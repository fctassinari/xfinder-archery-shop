package com.xfinder.api.payment;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Path("/api/payment")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Payment", description = "API para verificação de pagamentos")
public class PaymentResource {

    private static final String INFINITEPAY_BASE_URL = "https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari";
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @GET
    @Path("/check")
    @Operation(summary = "Verificar pagamento InfinitePay", 
               description = "Verifica o status de um pagamento no InfinitePay através do backend para evitar problemas de CORS")
    @APIResponse(responseCode = "200", description = "Status do pagamento verificado com sucesso",
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Parâmetros inválidos")
    @APIResponse(responseCode = "500", description = "Erro ao verificar pagamento")
    public Response checkPayment(
            @QueryParam("transaction_nsu") String transactionNsu,
            @QueryParam("external_order_nsu") String externalOrderNsu,
            @QueryParam("slug") String slug) {
        
        if (transactionNsu == null || externalOrderNsu == null || slug == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Parâmetros transaction_nsu, external_order_nsu e slug são obrigatórios\"}")
                    .build();
        }

        try {
            // Construir URL com query parameters
            String url = INFINITEPAY_BASE_URL + 
                        "?transaction_nsu=" + transactionNsu +
                        "&external_order_nsu=" + externalOrderNsu +
                        "&slug=" + slug;

            // Fazer requisição para a API do InfinitePay
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Retornar a resposta do InfinitePay para o frontend
            return Response.status(response.statusCode())
                    .entity(response.body())
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Erro ao verificar pagamento: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}
