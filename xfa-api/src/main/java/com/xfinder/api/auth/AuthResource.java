package com.xfinder.api.auth;

import com.xfinder.api.customers.CustomerDTO;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Authentication", description = "API para autenticação e informações do usuário")
public class AuthResource {

    @Inject
    KeycloakSyncService keycloakSyncService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/me")
    @RolesAllowed({"customer", "admin", "seller"})
    @Operation(summary = "Obter informações do usuário autenticado", 
               description = "Retorna informações do usuário extraídas do token JWT")
    @APIResponse(responseCode = "200", description = "Informações do usuário",
            content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "401", description = "Não autenticado")
    @APIResponse(responseCode = "403", description = "Sem permissão - verifique roles")
    public Response getCurrentUser() {
        // Log antes de verificar roles (se chegar aqui, significa que passou pela autenticação)
        System.err.println("\n✅ [AuthResource.getCurrentUser] Método executado - usuário autenticado!");
        logTokenInfo("getCurrentUser");
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("authenticated", true);
        userInfo.put("email", jwt.getClaim("email"));
        userInfo.put("name", jwt.getClaim("name"));
        userInfo.put("preferredUsername", jwt.getClaim("preferred_username"));
        userInfo.put("subject", jwt.getSubject());
        userInfo.put("roles", securityIdentity.getRoles());
        
        return Response.ok(userInfo).build();
    }

    @GET
    @Path("/customer")
    @RolesAllowed({"customer", "admin", "seller"})
    @Operation(summary = "Obter Customer vinculado ao usuário autenticado",
               description = "Retorna o Customer do PostgreSQL vinculado ao usuário do Keycloak")
    @APIResponse(responseCode = "200", description = "Customer encontrado",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerDTO.class)))
    @APIResponse(responseCode = "404", description = "Customer não encontrado")
    @APIResponse(responseCode = "401", description = "Não autenticado")
    @APIResponse(responseCode = "403", description = "Sem permissão - verifique roles")
    public Response getCurrentCustomer() {
        logTokenInfo("getCurrentCustomer");
        
        Optional<CustomerDTO> customer = keycloakSyncService.getCurrentCustomer();
        
        if (customer.isPresent()) {
            return Response.ok(customer.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Customer não encontrado para este usuário\"}")
                    .build();
        }
    }

    @POST
    @Path("/sync")
    @RolesAllowed({"customer", "admin", "seller"})
    @Operation(summary = "Sincronizar Customer com Keycloak",
               description = "Sincroniza ou cria um Customer baseado nos dados do token JWT")
    @APIResponse(responseCode = "200", description = "Customer sincronizado com sucesso",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerDTO.class)))
    @APIResponse(responseCode = "401", description = "Não autenticado")
    @APIResponse(responseCode = "403", description = "Sem permissão - verifique roles")
    public Response syncCustomer() {
        logTokenInfo("syncCustomer");
        try {
            CustomerDTO customer = keycloakSyncService.syncCustomerFromKeycloak();
            return Response.ok(customer).build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Erro ao sincronizar Customer: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/check")
    @Operation(summary = "Verificar status de autenticação",
               description = "Verifica se o usuário está autenticado (público - não requer roles)")
    @APIResponse(responseCode = "200", description = "Status de autenticação")
    public Response checkAuth() {
        Map<String, Object> status = new HashMap<>();
        status.put("authenticated", !securityIdentity.isAnonymous());
        
        if (!securityIdentity.isAnonymous()) {
            status.put("email", jwt.getClaim("email"));
            status.put("roles", securityIdentity.getRoles());
            status.put("roles_count", securityIdentity.getRoles().size());
            status.put("principal", securityIdentity.getPrincipal().getName());
            
            // Debug: informações do token
            try {
                Object realmAccess = jwt.getClaim("realm_access");
                status.put("realm_access", realmAccess);
                
                // Tentar extrair roles manualmente
                if (realmAccess instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> realmAccessMap = (Map<String, Object>) realmAccess;
                    Object roles = realmAccessMap.get("roles");
                    status.put("realm_access.roles", roles);
                }
            } catch (Exception e) {
                status.put("error_reading_realm_access", e.getMessage());
            }
        }
        
        return Response.ok(status).build();
    }

    @GET
    @Path("/debug")
    // Removido @RolesAllowed temporariamente para debug - permite acesso se autenticado
    @Operation(summary = "Debug - Informações detalhadas do token",
               description = "Retorna informações detalhadas do token JWT para debug (requer autenticação, mas não roles específicas)")
    @APIResponse(responseCode = "200", description = "Informações de debug")
    @APIResponse(responseCode = "401", description = "Não autenticado")
    public Response debugToken() {
        // Verificar se está autenticado (mas não requer roles específicas)
        if (securityIdentity.isAnonymous()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Não autenticado\"}")
                    .build();
        }
        Map<String, Object> debug = new HashMap<>();
        debug.put("authenticated", !securityIdentity.isAnonymous());
        debug.put("isAnonymous", securityIdentity.isAnonymous());
        debug.put("roles", securityIdentity.getRoles());
        debug.put("principal", securityIdentity.getPrincipal().getName());
        
        // Informações do token
        Map<String, Object> tokenInfo = new HashMap<>();
        tokenInfo.put("subject", jwt.getSubject());
        tokenInfo.put("email", jwt.getClaim("email"));
        tokenInfo.put("name", jwt.getClaim("name"));
        tokenInfo.put("preferred_username", jwt.getClaim("preferred_username"));
        
        // Tentar obter roles de diferentes formas
        try {
            Object realmAccess = jwt.getClaim("realm_access");
            tokenInfo.put("realm_access", realmAccess);
            
            Object resourceAccess = jwt.getClaim("resource_access");
            tokenInfo.put("resource_access", resourceAccess);
            
            // Tentar obter roles diretamente
            Object roles = jwt.getClaim("roles");
            tokenInfo.put("roles_claim", roles);
            
            // Tentar obter roles de realm_access.roles
            if (realmAccess instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> realmAccessMap = (Map<String, Object>) realmAccess;
                tokenInfo.put("realm_access.roles", realmAccessMap.get("roles"));
            }
        } catch (Exception e) {
            tokenInfo.put("error_reading_claims", e.getMessage());
        }
        
        debug.put("token", tokenInfo);
        
        // Log do token completo para debug
        logTokenInfo("debugToken");
        
        return Response.ok(debug).build();
    }
    
    /**
     * Método auxiliar para logar informações detalhadas do token JWT
     */
    private void logTokenInfo(String methodName) {
        if (securityIdentity.isAnonymous()) {
            System.out.println("=== TOKEN DEBUG [" + methodName + "] ===");
            System.out.println("Usuário não autenticado (anonymous)");
            System.out.println("========================================");
            return;
        }
        
        System.out.println("=== TOKEN DEBUG [" + methodName + "] ===");
        System.out.println("Principal: " + securityIdentity.getPrincipal().getName());
        System.out.println("Subject (sub): " + jwt.getSubject());
        System.out.println("Email: " + jwt.getClaim("email"));
        System.out.println("Name: " + jwt.getClaim("name"));
        System.out.println("Preferred Username: " + jwt.getClaim("preferred_username"));
        System.out.println("Roles (SecurityIdentity): " + securityIdentity.getRoles());
        System.out.println("Roles count: " + securityIdentity.getRoles().size());
        
        // Tentar obter realm_access
        try {
            Object realmAccess = jwt.getClaim("realm_access");
            System.out.println("realm_access: " + realmAccess);
            
            if (realmAccess instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> realmAccessMap = (Map<String, Object>) realmAccess;
                Object roles = realmAccessMap.get("roles");
                System.out.println("realm_access.roles: " + roles);
            }
        } catch (Exception e) {
            System.out.println("Erro ao ler realm_access: " + e.getMessage());
        }
        
        // Tentar obter resource_access
        try {
            Object resourceAccess = jwt.getClaim("resource_access");
            System.out.println("resource_access: " + resourceAccess);
        } catch (Exception e) {
            System.out.println("Erro ao ler resource_access: " + e.getMessage());
        }
        
        // Listar todos os claims disponíveis
        try {
            System.out.println("Todos os claims disponíveis:");
            for (String claimName : jwt.getClaimNames()) {
                Object claimValue = jwt.getClaim(claimName);
                System.out.println("  - " + claimName + ": " + claimValue);
            }
        } catch (Exception e) {
            System.out.println("Erro ao listar claims: " + e.getMessage());
        }
        
        System.out.println("========================================");
    }
}

