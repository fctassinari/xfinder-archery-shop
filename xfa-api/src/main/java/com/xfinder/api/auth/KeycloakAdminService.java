package com.xfinder.api.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Optional;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@ApplicationScoped
public class KeycloakAdminService {

    @Inject
    ObjectMapper objectMapper;

    @ConfigProperty(name = "keycloak.admin.url")
    Optional<String> keycloakAdminUrl;

    @ConfigProperty(name = "keycloak.admin.realm", defaultValue = "master")
    String keycloakAdminRealm;

    @ConfigProperty(name = "keycloak.admin.auth-realm", defaultValue = "master")
    Optional<String> keycloakAdminAuthRealm;

    @ConfigProperty(name = "keycloak.admin.client-id")
    Optional<String> keycloakAdminClientId;

    @ConfigProperty(name = "keycloak.admin.client-secret")
    Optional<String> keycloakAdminClientSecret;

    @ConfigProperty(name = "keycloak.admin.username")
    Optional<String> keycloakAdminUsername;

    @ConfigProperty(name = "keycloak.admin.password")
    Optional<String> keycloakAdminPassword;

    @ConfigProperty(name = "quarkus.profile", defaultValue = "prod")
    Optional<String> quarkusProfile;

    private HttpClient httpClient;
    private String cachedAccessToken;
    private long tokenExpiryTime;

    private HttpClient getHttpClient() {
        if (httpClient == null) {
            HttpClient.Builder builder = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10));
            
            // Em desenvolvimento, aceitar certificados auto-assinados
            String profile = quarkusProfile.orElse("prod");
            if ("dev".equals(profile)) {
                try {
                    SSLContext sslContext = SSLContext.getInstance("TLS");
                    TrustManager[] trustAllCerts = new TrustManager[]{
                        new X509TrustManager() {
                            public X509Certificate[] getAcceptedIssuers() {
                                return new X509Certificate[0];
                            }
                            public void checkClientTrusted(X509Certificate[] certs, String authType) {
                            }
                            public void checkServerTrusted(X509Certificate[] certs, String authType) {
                            }
                        }
                    };
                    sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
                    builder.sslContext(sslContext);
                } catch (NoSuchAlgorithmException | KeyManagementException e) {
                    System.err.println("Erro ao configurar SSLContext para aceitar todos os certificados: " + e.getMessage());
                }
            }
            
            httpClient = builder.build();
        }
        return httpClient;
    }

    /**
     * Obtém token de acesso do Keycloak Admin API
     */
    private String getAccessToken() throws Exception {
        // Verificar se o token ainda é válido (com margem de 60 segundos)
        if (cachedAccessToken != null && System.currentTimeMillis() < tokenExpiryTime - 60000) {
            return cachedAccessToken;
        }

        String url = keycloakAdminUrl.orElse("https://localhost:8443");
        // Usar realm de autenticação (geralmente "master") ou o realm configurado
        String authRealm = keycloakAdminAuthRealm.orElse("master");
        String tokenUrl = url + "/realms/" + authRealm + "/protocol/openid-connect/token";

        // Preparar body da requisição
        String requestBody;
        String clientId = keycloakAdminClientId.orElse("admin-cli");
        
        if (keycloakAdminUsername.isPresent() && keycloakAdminPassword.isPresent()) {
            // Usar Resource Owner Password Credentials Grant
            requestBody = "grant_type=password" +
                    "&client_id=" + clientId +
                    "&username=" + keycloakAdminUsername.get() +
                    "&password=" + keycloakAdminPassword.get();
        } else if (keycloakAdminClientSecret.isPresent()) {
            // Usar Client Credentials Grant
            requestBody = "grant_type=client_credentials" +
                    "&client_id=" + clientId +
                    "&client_secret=" + keycloakAdminClientSecret.get();
        } else {
            throw new IllegalStateException("Configuração do Keycloak Admin incompleta. Configure username/password ou client-secret");
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            String errorBody = response.body();
            System.err.println("Erro ao obter token do Keycloak:");
            System.err.println("  Status: " + response.statusCode());
            System.err.println("  URL: " + tokenUrl);
            System.err.println("  Client ID: " + clientId);
            System.err.println("  Realm: " + authRealm);
            System.err.println("  Response: " + errorBody);
            throw new RuntimeException("Erro ao obter token do Keycloak: " + response.statusCode() + " - " + errorBody);
        }

        JsonNode jsonResponse = objectMapper.readTree(response.body());
        String accessToken = jsonResponse.get("access_token").asText();
        int expiresIn = jsonResponse.get("expires_in").asInt();

        // Cache do token
        cachedAccessToken = accessToken;
        tokenExpiryTime = System.currentTimeMillis() + (expiresIn * 1000L);

        return accessToken;
    }

    /**
     * Deleta um usuário do Keycloak pelo seu ID
     */
    public void deleteUser(String keycloakUserId) throws Exception {
        if (keycloakUserId == null || keycloakUserId.isEmpty()) {
            throw new IllegalArgumentException("Keycloak User ID não pode ser nulo ou vazio");
        }

        String url = keycloakAdminUrl.orElse("https://localhost:8443");
        String realm = keycloakAdminRealm;
        String deleteUrl = url + "/admin/realms/" + realm + "/users/" + keycloakUserId;

        String accessToken = getAccessToken();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(deleteUrl))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .DELETE()
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        // 204 = No Content (sucesso)
        // 404 = Not Found (usuário já não existe, considerar sucesso)
        if (response.statusCode() != 204 && response.statusCode() != 404) {
            throw new RuntimeException("Erro ao deletar usuário do Keycloak: " + response.statusCode() + " - " + response.body());
        }
    }
}
