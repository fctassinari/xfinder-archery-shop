package com.xfinder.api.superfrete;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/superfrete")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Superfrete", description = "API para cálculo de frete e emissão de etiquetas via Superfrete")
public class SuperfreteResource {

    @Inject
    SuperfreteService superfreteService;

    @POST
    @Path("/calculate-freight")
    @Operation(summary = "Calcular frete", description = "Calcula o frete para os produtos informados baseado no CEP de destino")
    @APIResponse(responseCode = "200", description = "Frete calculado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response calculateFreight(FreightCalculationRequest request) {
        return superfreteService.calculateFreight(request);
    }

    // ========== ENDPOINTS DE PEDIDOS (ORDERS) ==========
    
    @POST
    @Path("/orders")
    @Operation(summary = "Criar pedido", description = "Cria um novo pedido (etiqueta) na SuperFrete")
    @APIResponse(responseCode = "200", description = "Pedido criado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response createOrder(OrderRequest request) {
        return superfreteService.createOrder(request);
    }

    @POST
    @Path("orders/checkout")
    @Operation(summary = "Finalizar checkout", description = "Finaliza o checkout de múltiplos pedidos para gerar etiquetas em lote")
    @APIResponse(responseCode = "200", description = "Checkout finalizado com sucesso",
            content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response checkoutOrder(OrderListRequest request) {
        return superfreteService.checkoutOrder(request);
    }

    @GET
    @Path("/orders/{orderId}")
    @Operation(summary = "Obter pedido", description = "Retorna informações detalhadas de um pedido específico")
    @APIResponse(responseCode = "200", description = "Pedido encontrado", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "404", description = "Pedido não encontrado")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response getOrder(@PathParam("orderId") String orderId) {
        return superfreteService.getOrder(orderId);
    }

    @POST
    @Path("/orders/print")
    @Operation(summary = "Imprimir etiqueta", description = "Obtém o link para impressão da etiqueta em PDF")
    @APIResponse(responseCode = "200", description = "Link de impressão gerado", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Erro ao gerar link de impressão")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response printOrder(OrderListRequest request) {
        return superfreteService.printOrder(request);
    }

    @POST
    @Path("/order/cancel")
    @Operation(summary = "Cancelar pedido com descrição", description = "Cancela um pedido com descrição do motivo do cancelamento")
    @APIResponse(responseCode = "200", description = "Pedido cancelado com sucesso",
            content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Erro ao cancelar pedido")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response cancelOrder(OrderCancelRequest request) {
        return superfreteService.cancelOrder(request);
    }

    // ========== ENDPOINTS DE USUÁRIO ==========

    @GET
    @Path("/user")
    @Operation(summary = "Informações do usuário", description = "Retorna informações da conta do usuário na SuperFrete")
    @APIResponse(responseCode = "200", description = "Informações do usuário",
            content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response getUserInfo() {
        return superfreteService.getUserInfo();
    }

    @GET
    @Path("/user/addresses")
    @Operation(summary = "Endereços do usuário", description = "Retorna a lista de endereços cadastrados do usuário")
    @APIResponse(responseCode = "200", description = "Lista de endereços",
            content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response getUserAddresses() {
        return superfreteService.getUserAddresses();
    }

    // ========== HEALTH CHECK ==========
   
    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API Superfrete está funcionando")
    @APIResponse(responseCode = "200", description = "API funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Superfrete funcionando!\", \"timestamp\": \"" + 
                          java.time.LocalDateTime.now() + "\"}").build();
    }
}

