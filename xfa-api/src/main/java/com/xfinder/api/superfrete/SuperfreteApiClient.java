package com.xfinder.api.superfrete;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@RegisterRestClient(configKey = "superfrete-api")
@Path("/api/v0")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface SuperfreteApiClient {

    // Cálculo de Frete
    @POST
    @Path("/calculator")
    Response calculateFreight(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        SuperfreteCalculationRequest request
    );

    // Pedidos (Orders) - Usa /cart conforme documentação da SuperFrete
    @POST
    @Path("/cart")
    Response createOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        OrderRequest request
    );

    @GET
    @Path("/orders/{orderId}")
    Response getOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("orderId") String orderId
    );

    @POST
    @Path("/orders/{orderId}/finish")
    Response finishOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("orderId") String orderId
    );

    @POST
    @Path("/orders/{orderId}/cancel")
    Response cancelOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("orderId") String orderId
    );

    @POST
    @Path("/orders/{orderId}/print")
    Response printOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("orderId") String orderId
    );

    // Tracking (Rastreamento)
    @GET
    @Path("/tracking/{trackingCode}")
    Response getTracking(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("trackingCode") String trackingCode
    );

    // Webhooks
    @POST
    @Path("/webhooks")
    Response createWebhook(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        WebhookRequest request
    );

    @GET
    @Path("/webhooks")
    Response listWebhooks(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent
    );

    @PUT
    @Path("/webhooks/{webhookId}")
    Response updateWebhook(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("webhookId") String webhookId,
        WebhookRequest request
    );

    @DELETE
    @Path("/webhooks/{webhookId}")
    Response deleteWebhook(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("webhookId") String webhookId
    );

    // Usuário
    @GET
    @Path("/user")
    Response getUserInfo(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent
    );

    @GET
    @Path("/user/addresses")
    Response getUserAddresses(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent
    );
}

