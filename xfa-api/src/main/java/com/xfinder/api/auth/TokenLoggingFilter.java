package com.xfinder.api.auth;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.io.IOException;
import java.util.Map;

/**
 * Filtro para logar informações do token JWT em todas as requisições autenticadas.
 * 
 * Este filtro roda ANTES da verificação de @RolesAllowed, permitindo ver
 * o que está no token mesmo quando a requisição é rejeitada por falta de roles.
 */
@Provider
@Priority(Priorities.AUTHENTICATION - 10) // Roda MUITO ANTES da autenticação para garantir que seja executado
public class TokenLoggingFilter implements ContainerRequestFilter {

    // Injeção - pode ser null se ainda não autenticado (trataremos null)
    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        
        // Logar TODAS as requisições para debug - SEMPRE executar
        System.err.println("\n═══════════════════════════════════════════════════════");
        System.err.println("🔍 [TokenLoggingFilter] FILTRO EXECUTADO!");
        System.err.println("🔍 [TokenLoggingFilter] Path: " + path);
        System.err.println("🔍 [TokenLoggingFilter] Method: " + requestContext.getMethod());
        
        // Aplicar apenas aos endpoints de auth
        if (path.startsWith("/api/auth/")) {
            System.err.println("✅ [TokenLoggingFilter] Endpoint de auth detectado, logando detalhes...");
            System.err.println("=== TOKEN FILTER [" + path + "] ===");
            System.err.println("Method: " + requestContext.getMethod());
            
            // Verificar se há token no header
            String authHeader = requestContext.getHeaderString("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.err.println("✅ Token presente no header (primeiros 50 chars): " + 
                    (token.length() > 50 ? token.substring(0, 50) + "..." : token));
            } else {
                System.err.println("❌ Token NÃO encontrado no header Authorization");
                System.err.println("   Headers disponíveis: " + requestContext.getHeaders().keySet());
            }
            
            // Verificar SecurityIdentity (pode ser null se ainda não autenticado)
            if (securityIdentity != null) {
                System.err.println("SecurityIdentity.isAnonymous(): " + securityIdentity.isAnonymous());
            } else {
                System.err.println("⚠️  SecurityIdentity é NULL (ainda não autenticado)");
            }
            
            if (securityIdentity != null && !securityIdentity.isAnonymous() && jwt != null) {
                System.err.println("Principal: " + securityIdentity.getPrincipal().getName());
                System.err.println("Subject (sub): " + jwt.getSubject());
                System.err.println("Email: " + jwt.getClaim("email"));
                System.err.println("Name: " + jwt.getClaim("name"));
                System.err.println("Preferred Username: " + jwt.getClaim("preferred_username"));
                
                // Roles do SecurityIdentity
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
                            java.util.List<?> rolesList = (java.util.List<?>) roles;
                            System.err.println("realm_access.roles (lista): " + rolesList);
                            if (!rolesList.isEmpty() && rolesList.get(0) != null) {
                                System.err.println("Tipo dos elementos: " + rolesList.get(0).getClass().getName());
                            }
                            // Verificar se contém "customer" (pode ser String ou outro tipo)
                            boolean containsCustomer = rolesList.stream()
                                .filter(role -> role != null)
                                .anyMatch(role -> "customer".equals(role.toString()));
                            System.err.println("Contém 'customer'? " + containsCustomer);
                            // Listar todas as roles como string para debug
                            System.err.println("Roles como strings: " + rolesList.stream()
                                .filter(role -> role != null)
                                .map(Object::toString)
                                .toList());
                        } else {
                            System.err.println("⚠️  roles não é uma List, é: " + (roles != null ? roles.getClass().getName() : "null"));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("❌ Erro ao ler realm_access: " + e.getMessage());
                    e.printStackTrace();
                }
                
                // Tentar obter resource_access
                try {
                    Object resourceAccess = jwt.getClaim("resource_access");
                    System.err.println("resource_access: " + resourceAccess);
                } catch (Exception e) {
                    System.err.println("❌ Erro ao ler resource_access: " + e.getMessage());
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
                System.err.println("   securityIdentity == null: " + (securityIdentity == null));
                System.err.println("   jwt == null: " + (jwt == null));
                if (securityIdentity != null) {
                    System.err.println("   securityIdentity.isAnonymous(): " + securityIdentity.isAnonymous());
                }
            }
            
            System.err.println("═══════════════════════════════════════════════════════\n");
        } else {
            System.err.println("⏭️  [TokenLoggingFilter] Endpoint não é de auth, pulando log detalhado");
            System.err.println("═══════════════════════════════════════════════════════\n");
        }
    }
}

