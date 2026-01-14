package com.xfinder.api.config;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Path("/api/config")
@Produces(MediaType.APPLICATION_JSON)
@ApplicationScoped
@Tag(name = "Config", description = "API para configurações do frontend")
public class ConfigResource {

    // Keycloak
    @ConfigProperty(name = "frontend.keycloak.url", defaultValue = "https://localhost:8443")
    String keycloakUrl;

    @ConfigProperty(name = "frontend.keycloak.realm", defaultValue = "xfinder")
    String keycloakRealm;

    @ConfigProperty(name = "frontend.keycloak.client-id", defaultValue = "xfinder-web")
    String keycloakClientId;

    // API URLs
    @ConfigProperty(name = "frontend.api.base-url", defaultValue = "http://localhost:8081")
    String apiBaseUrl;

    @ConfigProperty(name = "frontend.api.products-url", defaultValue = "http://localhost:8081/api/products")
    String productsUrl;

    @ConfigProperty(name = "frontend.api.customers-url", defaultValue = "http://localhost:8081/api/customers")
    String customersUrl;

    @ConfigProperty(name = "frontend.api.orders-url", defaultValue = "http://localhost:8081/api/orders")
    String ordersUrl;

    @ConfigProperty(name = "frontend.api.mail-url", defaultValue = "http://localhost:8081/api/mail")
    String mailUrl;

    @ConfigProperty(name = "frontend.api.superfrete-url", defaultValue = "http://localhost:8081/api/superfrete/calculate-freight")
    String superfreteUrl;

    // App URLs
    @ConfigProperty(name = "frontend.app.base-url", defaultValue = "http://localhost:8080")
    String appBaseUrl;

    @ConfigProperty(name = "frontend.app.image-url", defaultValue = "http://localhost:8080")
    String imageUrl;

    // Payment
    @ConfigProperty(name = "frontend.payment.checkout-base-url", defaultValue = "https://checkout.infinitepay.io/fctassinari")
    String checkoutBaseUrl;

    // Store Info
    @ConfigProperty(name = "frontend.store.postal-code", defaultValue = "03167030")
    String storePostalCode;

    @ConfigProperty(name = "frontend.store.email", defaultValue = "contato.xfinder@gmail.com.br")
    String storeEmail;

    @ConfigProperty(name = "frontend.store.name", defaultValue = "Fabio Tassinari")
    String storeName;

    @ConfigProperty(name = "frontend.store.phone", defaultValue = "11991318744")
    String storePhone;

    @ConfigProperty(name = "frontend.store.address", defaultValue = "Rua dos Capitães Mores")
    String storeAddress;

    @ConfigProperty(name = "frontend.store.number", defaultValue = "346")
    String storeNumber;

    @ConfigProperty(name = "frontend.store.complement", defaultValue = "Apto 101B")
    String storeComplement;

    @ConfigProperty(name = "frontend.store.district", defaultValue = "Mooca")
    String storeDistrict;

    @ConfigProperty(name = "frontend.store.city", defaultValue = "São Paulo")
    String storeCity;

    @ConfigProperty(name = "frontend.store.state", defaultValue = "SP")
    String storeState;

    // Features
    @ConfigProperty(name = "frontend.features.use-mock-checkout", defaultValue = "false")
    String useMockCheckout;

    // Google Maps
    @ConfigProperty(name = "frontend.google-maps.api-key")
    Optional<String> googleMapsApiKey;

    @GET
    @Path("/frontend")
    @Operation(summary = "Obter configurações do frontend", description = "Retorna todas as configurações necessárias para o frontend")
    @APIResponse(responseCode = "200", description = "Configurações retornadas com sucesso",
                 content = @Content(mediaType = "application/json"))
    public Response getFrontendConfig() {
        Map<String, Object> config = new HashMap<>();

        // Keycloak
        Map<String, String> keycloak = new HashMap<>();
        keycloak.put("url", keycloakUrl);
        keycloak.put("realm", keycloakRealm);
        keycloak.put("clientId", keycloakClientId);
        config.put("keycloak", keycloak);

        // API
        Map<String, String> api = new HashMap<>();
        api.put("baseUrl", apiBaseUrl);
        api.put("productsUrl", productsUrl);
        api.put("customersUrl", customersUrl);
        api.put("ordersUrl", ordersUrl);
        api.put("mailUrl", mailUrl);
        api.put("superfreteUrl", superfreteUrl);
        config.put("api", api);

        // App
        Map<String, String> app = new HashMap<>();
        app.put("baseUrl", appBaseUrl);
        app.put("imageUrl", imageUrl);
        config.put("app", app);

        // Payment
        Map<String, String> payment = new HashMap<>();
        payment.put("checkoutBaseUrl", checkoutBaseUrl);
        config.put("payment", payment);

        // Store
        Map<String, String> store = new HashMap<>();
        store.put("postalCode", storePostalCode);
        store.put("email", storeEmail);
        store.put("name", storeName);
        store.put("phone", storePhone);
        store.put("address", storeAddress);
        store.put("number", storeNumber);
        store.put("complement", storeComplement);
        store.put("district", storeDistrict);
        store.put("city", storeCity);
        store.put("state", storeState);
        config.put("store", store);

        // Features
        Map<String, Boolean> features = new HashMap<>();
        features.put("useMockCheckout", Boolean.parseBoolean(useMockCheckout));
        config.put("features", features);

        // Google Maps
        Map<String, String> googleMaps = new HashMap<>();
        googleMaps.put("apiKey", googleMapsApiKey.orElse(""));
        config.put("googleMaps", googleMaps);

        return Response.ok(config)
                .header("Cache-Control", "public, max-age=3600")
                .build();
    }
}
