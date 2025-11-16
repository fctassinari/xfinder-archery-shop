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
    // Enviar Frete para a SuperFrete
    @POST
    @Path("/cart")
    Response createOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        OrderRequest request
    );

    // Checkout - Finalizar múltiplos pedidos
    @POST
    @Path("/checkout")
    Response checkoutOrder(
            @HeaderParam("Authorization") String authorization,
            @HeaderParam("User-Agent") String userAgent,
            OrderListRequest request
    );

    // Informações do pedido
    @GET
    @Path("/order/info/{orderId}")
    Response getOrder(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        @PathParam("orderId") String orderId
    );

    @POST
    @Path("/tag/print")
    Response printOrder(
            @HeaderParam("Authorization") String authorization,
            @HeaderParam("User-Agent") String userAgent,
            OrderListRequest request
    );

    // Cancelar pedido com corpo JSON (nova versão)
    @POST
    @Path("/order/cancel")
    Response cancelOrder(
            @HeaderParam("Authorization") String authorization,
            @HeaderParam("User-Agent") String userAgent,
            OrderCancelRequest request
    );

    @GET
    @Path("/user/addresses")
    Response getUserAddresses(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent
    );

    // Usuário
    @GET
    @Path("/user")
    Response getUserInfo(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent
    );

}

