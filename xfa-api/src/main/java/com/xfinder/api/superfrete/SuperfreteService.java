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

    @ConfigProperty(name = "superfrete.store.postal-code", defaultValue = "01153000")
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
//            System.out.println("JSON da Requisição Superfrete: " + objectMapper.writeValueAsString(superfreteRequest));

            // Fazer requisição
            Response response = superfreteApiClient.calculateFreight(authorization, userAgent, superfreteRequest);

            // Ler a entidade da resposta como String para poder imprimir e retornar
//            String responseBody = response.readEntity(String.class);
//            System.out.println("JSON da Resposta Superfrete: " + responseBody);

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
            System.out.println(e.getMessage());
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

    public Response createLabel(LabelCreationRequest request) {
        try {
            // Validação dos dados
            if (request.getFrom() == null || request.getTo() == null ||
                    request.getService() == null || request.getVolume() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Todos os campos são obrigatórios: from, to, service, volume\"}")
                        .build();
            }

            // Headers
            String authorization = "Bearer " + apiToken.orElse("YOUR_SUPERFRETE_API_TOKEN");
            String userAgent = "XFinderArcheryShop/1.0 (" + storeEmail + ")";

            // Fazer requisição
            Response response = superfreteApiClient.createLabel(authorization, userAgent, request);

            if (response.getStatus() == 200) {
                return Response.ok(response.readEntity(String.class)).build();
            } else {
                String errorBody = response.readEntity(String.class);
                return Response.status(response.getStatus())
                        .entity("{\"error\": \"Erro ao criar etiqueta\", \"details\": \"" + errorBody + "\"}")
                        .build();
            }

        } catch (Exception e) {
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
}



