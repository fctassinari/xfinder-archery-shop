package com.xfinder.api.superfrete;


import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper; // Importar ObjectMapper


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

    @ConfigProperty(name = "superfrete.store.email", defaultValue = "contato@xfinderarchery.com.br")
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
                return Response.ok(response.readEntity(String.class)).build();
            } else {
                String errorBody = response.readEntity(String.class);
                return Response.status(response.getStatus())
                        .entity("{\"error\": \"Erro ao calcular frete\", \"details\": \"" + errorBody + "\"}")
                        .build();
            }

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
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
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}

