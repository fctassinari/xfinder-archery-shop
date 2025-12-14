package com.xfinder.api.auth;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Map;

/**
 * ExceptionMapper para capturar erros 403 e logar informações do token.
 * 
 * Este mapper é executado quando uma exceção ForbiddenException é lançada,
 * permitindo ver o que está no token mesmo quando a requisição é rejeitada.
 */
@Provider
public class AuthExceptionMapper implements ExceptionMapper<ForbiddenException> {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @Override
    public Response toResponse(ForbiddenException exception) {
        // Logar informações do token quando ocorre 403
        System.err.println("\n═══════════════════════════════════════════════════════");
        System.err.println("❌ ERRO 403 (Forbidden) DETECTADO!");
        System.err.println("═══════════════════════════════════════════════════════");
        
        if (securityIdentity != null) {
            System.err.println("SecurityIdentity.isAnonymous(): " + securityIdentity.isAnonymous());
            
            if (!securityIdentity.isAnonymous() && jwt != null) {
                System.err.println("Principal: " + securityIdentity.getPrincipal().getName());
                System.err.println("Subject (sub): " + jwt.getSubject());
                System.err.println("Email: " + jwt.getClaim("email"));
                System.err.println("Roles (SecurityIdentity.getRoles()): " + securityIdentity.getRoles());
                System.err.println("Roles count: " + securityIdentity.getRoles().size());
                
                // Tentar obter realm_access
                try {
                    Object realmAccess = jwt.getClaim("realm_access");
                    System.err.println("realm_access: " + realmAccess);
                    
                    if (realmAccess instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> realmAccessMap = (Map<String, Object>) realmAccess;
                        Object roles = realmAccessMap.get("roles");
                        System.err.println("realm_access.roles: " + roles);
                        
                        if (roles instanceof java.util.List) {
                            @SuppressWarnings("unchecked")
                            java.util.List<String> rolesList = (java.util.List<String>) roles;
                            System.err.println("realm_access.roles (lista): " + rolesList);
                            System.err.println("Contém 'customer'? " + rolesList.contains("customer"));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("❌ Erro ao ler realm_access: " + e.getMessage());
                    e.printStackTrace();
                }
                
                // Listar todos os claims disponíveis
                try {
                    System.err.println("Todos os claims disponíveis:");
                    for (String claimName : jwt.getClaimNames()) {
                        Object claimValue = jwt.getClaim(claimName);
                        System.err.println("  - " + claimName + ": " + claimValue);
                    }
                } catch (Exception e) {
                    System.err.println("❌ Erro ao listar claims: " + e.getMessage());
                }
            } else {
                System.err.println("⚠️  Usuário não autenticado ou JWT não disponível");
                System.err.println("   securityIdentity.isAnonymous(): " + (securityIdentity != null ? securityIdentity.isAnonymous() : "null"));
                System.err.println("   jwt == null: " + (jwt == null));
            }
        } else {
            System.err.println("⚠️  SecurityIdentity é NULL");
        }
        
        System.err.println("═══════════════════════════════════════════════════════\n");
        
        // Retornar resposta 403 padrão
        return Response.status(Response.Status.FORBIDDEN)
                .entity("{\"error\": \"Acesso negado. Verifique se você tem as permissões necessárias.\"}")
                .build();
    }
}

