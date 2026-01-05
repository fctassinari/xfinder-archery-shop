package com.xfinder.api.superfrete;


import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

@ApplicationScoped
public class SuperfreteService {

    @Inject
    ObjectMapper objectMapper; // Injetar ObjectMapper

    @Inject
    @RestClient
    SuperfreteApiClient superfreteApiClient;

    @ConfigProperty(name = "superfrete.api.token")
    Optional<String> apiToken;

    @ConfigProperty(name = "superfrete.store.postal-code", defaultValue = "03167030")
    String storePostalCode;

    @ConfigProperty(name = "superfrete.store.email", defaultValue = "contato.xfinder@gmail.com.br")
    String storeEmail;

    public Response calculateFreight(FreightCalculationRequest request) {
        try {
            // Validação dos dados
            if (request.getCep() == null || request.getCep().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"CEP é obrigatório\"}")
                        .build();
            }

            if (request.getProducts() == null || request.getProducts().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Produtos são obrigatórios\"}")
                        .build();
            }

            // Limpar CEP
            String cleanCep = request.getCep().replaceAll("[^0-9]", "");

            // Preparar dados para a API Superfrete
            SuperfreteCalculationRequest superfreteRequest = new SuperfreteCalculationRequest();
            superfreteRequest.setFrom(new SuperfreteCalculationRequest.PostalCodeInfo(storePostalCode));
            superfreteRequest.setTo(new SuperfreteCalculationRequest.PostalCodeInfo(cleanCep));
//            superfreteRequest.setServices("1,2,17,3,31"); // PAC, SEDEX, Mini Envios, Jadlog, Loggi
            superfreteRequest.setServices("1,2,17"); // PAC, SEDEX, Mini Envios
            superfreteRequest.setProducts(request.getProducts());

            // Configurar opções
            SuperfreteCalculationRequest.OptionsInfo options = new SuperfreteCalculationRequest.OptionsInfo();
            options.setOwnHand(false);
            options.setReceipt(false);
            options.setInsuranceValue(request.getInsuranceValue() != null ? request.getInsuranceValue() : 0.0);
            options.setUseInsuranceValue(request.getUseInsuranceValue() != null ? request.getUseInsuranceValue() : false);
            superfreteRequest.setOptions(options);

            // Headers
            String authorization = "Bearer " + apiToken.orElse("YOUR_SUPERFRETE_API_TOKEN");
            String userAgent = "XFinderArcheryShop/1.0 (" + storeEmail + ")";

            // Imprimir JSON da requisição ANTES de enviá-la
//            System.out.println("\nJSON da Requisição Superfrete: " + objectMapper.writeValueAsString(superfreteRequest));

            // Fazer requisição
            Response response = superfreteApiClient.calculateFreight(authorization, userAgent, superfreteRequest);

            // Ler a entidade da resposta como String para poder imprimir e retornar
//            String resp = response.readEntity(String.class);
//            System.out.println("\nJSON da Resposta Superfrete: " + resp);


            if (response.getStatus() == 200) {
                String responseBody = response.readEntity(String.class);
                // 1. Verificar se a lista de fretes está vazia
                JsonNode rootNode = objectMapper.readTree(responseBody);
//                System.out.println("rootNode.isArray()="+rootNode.isArray());
//                System.out.println("rootNode.size()="+rootNode.size());
                if (rootNode.isArray() && rootNode.size() == 0) {
                    // Se a lista estiver vazia, adicionar "Em Mãos" e "Correios"
                    String fallbackResponse = addHandDeliveryAndCorreiosOption("[]");
                    return Response.ok(fallbackResponse).build();
                }

                // 2. Se a lista não estiver vazia, adicionar apenas a opção "Em Mãos"
                String modifiedResponse = addHandDeliveryOption(responseBody);

                return Response.ok(modifiedResponse).build();
                //return Response.ok(response.readEntity(String.class)).build();
            } else {
                // Em caso de erro na API (status != 200), retornar "Em Mãos" e "Correios"
                String fallbackResponse = addHandDeliveryAndCorreiosOption("[]");
                return Response.ok(fallbackResponse).build();
            }

        } catch (Exception e) {
            System.out.println(">>>>>>>>>>>>>>>>"+e.getMessage());
            // Em caso de exceção, retornar "Em Mãos" e "Correios"
            try {
                String fallbackResponse = addHandDeliveryAndCorreiosOption("[]");
                return Response.ok(fallbackResponse).build();
            } catch (JsonProcessingException ex) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\": \"" + ex.getMessage() + "\"}")
                        .build();
            }
        }
    }

    /**
     * Adiciona a opção "Em Mãos" ao array de respostas de frete
     */
    private String addHandDeliveryOption(String originalResponse) throws JsonProcessingException {
        // Converter a resposta original para um array de JsonNode
        JsonNode[] shippingOptions = objectMapper.readValue(originalResponse, JsonNode[].class);

//        System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(shippingOptions));

        // Criar a opção "Em Mãos"
        String handDeliveryJson = """
	        {
	            "id": 99,
	            "name": "Em Mãos",
	            "price": "0.0",
	            "delivery_time": "A combinar",
	            "company": {
	                "id": 99,
	                "name": "XFinder",
	                "picture": "https://xfinder-archery.com.br"
	            }
	        }
	        """;

        JsonNode handDeliveryNode = objectMapper.readTree(handDeliveryJson);

        // Criar uma nova lista combinando as opções originais com a nova opção
        List<JsonNode> allOptions = new ArrayList<>();

        // Adicionar primeiro a opção "Em Mãos"
        allOptions.add(handDeliveryNode);

        // Adicionar todas as opções originais
        for (JsonNode option : shippingOptions) {
            if (!option.has("error")) {  // verifica se o campo "error" não existe
                allOptions.add(option);
            }
        }
//        System.out.println("allOptions.size()=" + allOptions.size());
        if(allOptions.size() == 1){
            // Criar a opção "Correios" (fallback)
            String correiosFallbackJson = """
	        {
	            "id": 999,
	            "name": "Correios",
	            "price": "10.0",
	            "delivery_time": "3",
	            "company": {
	                "id": 999,
	                "name": "Correios",
	                "picture":  "https://storage.googleapis.com/sandbox-api-superfrete.appspot.com/logos/correios.png"
	            }
	        }
	        """;
            JsonNode correiosFallbackNode = objectMapper.readTree(correiosFallbackJson);
            allOptions.add(correiosFallbackNode);
        }


        // Converter de volta para JSON string
        return objectMapper.writeValueAsString(allOptions);
    }

    /**
     * Adiciona a opção "Em Mãos" e a opção "Correios" (fallback) ao array de respostas de frete
     */
    private String addHandDeliveryAndCorreiosOption(String originalResponse) throws JsonProcessingException {
        // Criar a opção "Em Mãos"
        String handDeliveryJson = """
	        {
	            "id": 99,
	            "name": "Em Mãos",
	            "price": "0.0",
	            "delivery_time": "A combinar",
	            "company": {
	                "id": 99,
	                "name": "XFinder",
	                "picture": "https://xfinder-archery.com.br"
	            }
	        }
	        """;

        // Criar a opção "Correios" (fallback)
        String correiosFallbackJson = """
	        {
	            "id": 999,
	            "name": "Correios",
	            "price": "10.0",
	            "delivery_time": "3",
	            "company": {
	                "id": 999,
	                "name": "Correios",
	                "picture":  "https://storage.googleapis.com/sandbox-api-superfrete.appspot.com/logos/correios.png"
	            }
	        }
	        """;

        JsonNode handDeliveryNode = objectMapper.readTree(handDeliveryJson);
        JsonNode correiosFallbackNode = objectMapper.readTree(correiosFallbackJson);

        // Criar uma nova lista com as duas opções
        List<JsonNode> allOptions = new ArrayList<>();

        // Adicionar primeiro a opção "Em Mãos"
        allOptions.add(handDeliveryNode);

        // Adicionar a opção "Correios"
        allOptions.add(correiosFallbackNode);

        // Converter de volta para JSON string
        return objectMapper.writeValueAsString(allOptions);
    }

    /**
     * Métodos auxiliares para obter headers
     */
    private String getAuthorizationHeader() {
        return "Bearer " + apiToken.orElse("YOUR_SUPERFRETE_API_TOKEN");
    }

    private String getUserAgentHeader() {
        return "XFinderArcheryShop/1.0 (" + storeEmail + ")";
    }

    /**
     * Criar um novo pedido (etiqueta)
     */
    public Response createOrder(OrderRequest request) {
        try {
            // Validações básicas
            if (request == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Request não pode ser nulo\"}")
                        .build();
            }
            
            if (request.getFrom() == null || request.getTo() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Endereços 'from' e 'to' são obrigatórios\"}")
                        .build();
            }
            
            if (request.getProducts() == null || request.getProducts().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Lista de produtos não pode estar vazia\"}")
                        .build();
            }
            
            if (request.getVolume() == null || request.getVolume().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Lista de volumes não pode estar vazia\"}")
                        .build();
            }
            
            System.out.println("📦 Criando pedido na SuperFrete...");
            try {
                System.out.println("📦 Request: " + objectMapper.writeValueAsString(request));
            } catch (JsonProcessingException e) {
                System.out.println("📦 Request: [erro ao serializar]");
            }
            
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();
            
            Response response = null;
            String responseBody = null;
            try {
                response = superfreteApiClient.createOrder(authorization, userAgent, request);
                responseBody = response.readEntity(String.class);
                
                System.out.println("📦 Response Status: " + response.getStatus());
                System.out.println("📦 Response Body: " + (responseBody.length() > 500 ? 
                        responseBody.substring(0, 500) + "..." : responseBody));
                
                // Verificar se a resposta é HTML (erro)
                if (responseBody.trim().startsWith("<!") || responseBody.trim().startsWith("<html")) {
                    System.err.println("❌ Erro: API SuperFrete retornou HTML ao invés de JSON");
                    return Response.status(Response.Status.BAD_GATEWAY)
                            .entity("{\"error\": \"API SuperFrete retornou resposta inválida (HTML)\", \"details\": \"" + 
                                    responseBody.substring(0, Math.min(200, responseBody.length())).replace("\"", "\\\"") + "\"}")
                            .build();
                }
                
                return Response.status(response.getStatus())
                        .entity(responseBody)
                        .build();
            } catch (org.jboss.resteasy.client.exception.ResteasyBadRequestException e) {
                // Capturar erro 400 e tentar extrair detalhes
                System.err.println("❌ Erro 400 Bad Request da SuperFrete");
                System.err.println("❌ Mensagem: " + e.getMessage());
                System.err.println("❌ Causa: " + (e.getCause() != null ? e.getCause().getMessage() : "null"));
                
                // Extrair mensagem de erro
                String errorMessage = e.getMessage();
                String causeMessage = e.getCause() != null ? e.getCause().getMessage() : "";
                
                // Construir mensagem de erro detalhada
                String errorDetails = errorMessage;
                if (causeMessage != null && !causeMessage.isEmpty() && !causeMessage.equals(errorMessage)) {
                    errorDetails = errorMessage + " | Causa: " + causeMessage;
                }
                
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Erro ao criar pedido na SuperFrete\", " +
                                "\"message\": \"" + errorMessage.replace("\"", "\\\"").replace("\n", " ").replace("\r", " ") + "\", " +
                                "\"details\": \"" + errorDetails.replace("\"", "\\\"").replace("\n", " ").replace("\r", " ") + "\"}")
                        .build();
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar pedido na SuperFrete: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Erro interno ao processar requisição\", " +
                            "\"message\": \"" + e.getMessage().replace("\"", "\\\"").replace("\n", " ") + "\"}")
                    .build();
        }
    }

    /**
     * Finalizar checkout de múltiplos pedidos
     */
    public Response checkoutOrder(OrderListRequest request) {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();

            Response response = superfreteApiClient.checkoutOrder(authorization, userAgent, request);
            String responseBody = response.readEntity(String.class);

            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }



    /**
     * Obter informações de um pedido
     */
    public Response getOrder(String orderId) {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();
            
            Response response = superfreteApiClient.getOrder(authorization, userAgent, orderId);
            String responseBody = response.readEntity(String.class);
            
            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Obter link de impressão da etiqueta
     */
    public Response printOrder(OrderListRequest lista) {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();
            
            Response response = superfreteApiClient.printOrder(authorization, userAgent, lista);
            String responseBody = response.readEntity(String.class);
            
            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Cancelar pedido
     */
    public Response cancelOrder(OrderCancelRequest request) {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();

            Response response = superfreteApiClient.cancelOrder(authorization, userAgent, request);
            String responseBody = response.readEntity(String.class);

            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Obter informações do usuário
     */
    public Response getUserInfo() {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();
            
            Response response = superfreteApiClient.getUserInfo(authorization, userAgent);
            String responseBody = response.readEntity(String.class);
            
            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Listar endereços do usuário
     */
    public Response getUserAddresses() {
        try {
            String authorization = getAuthorizationHeader();
            String userAgent = getUserAgentHeader();
            
            Response response = superfreteApiClient.getUserAddresses(authorization, userAgent);
            String responseBody = response.readEntity(String.class);
            
            return Response.status(response.getStatus())
                    .entity(responseBody)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}



