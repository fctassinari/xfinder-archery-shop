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
    @Path("/orders/{orderId}/finish")
    @Operation(summary = "Finalizar pedido", description = "Finaliza o pedido e gera a etiqueta de envio")
    @APIResponse(responseCode = "200", description = "Pedido finalizado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Erro ao finalizar pedido")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response finishOrder(@PathParam("orderId") String orderId) {
        return superfreteService.finishOrder(orderId);
    }

    @POST
    @Path("/orders/{orderId}/cancel")
    @Operation(summary = "Cancelar pedido", description = "Cancela um pedido que ainda não foi postado")
    @APIResponse(responseCode = "200", description = "Pedido cancelado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Erro ao cancelar pedido")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response cancelOrder(@PathParam("orderId") String orderId) {
        return superfreteService.cancelOrder(orderId);
    }

    @POST
    @Path("/orders/{orderId}/print")
    @Operation(summary = "Imprimir etiqueta", description = "Obtém o link para impressão da etiqueta em PDF")
    @APIResponse(responseCode = "200", description = "Link de impressão gerado", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Erro ao gerar link de impressão")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response printOrder(@PathParam("orderId") String orderId) {
        return superfreteService.printOrder(orderId);
    }

    // ========== ENDPOINTS DE RASTREAMENTO (TRACKING) ==========
    
    @GET
    @Path("/tracking/{trackingCode}")
    @Operation(summary = "Rastrear envio", description = "Obtém informações de rastreamento de um envio pelo código de rastreio")
    @APIResponse(responseCode = "200", description = "Informações de rastreamento encontradas", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "404", description = "Código de rastreio não encontrado")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response getTracking(@PathParam("trackingCode") String trackingCode) {
        return superfreteService.getTracking(trackingCode);
    }

    // ========== ENDPOINTS DE WEBHOOKS ==========
    
    @POST
    @Path("/webhooks")
    @Operation(summary = "Criar webhook", description = "Cria um novo webhook para receber notificações de eventos")
    @APIResponse(responseCode = "200", description = "Webhook criado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response createWebhook(WebhookRequest request) {
        return superfreteService.createWebhook(request);
    }

    @GET
    @Path("/webhooks")
    @Operation(summary = "Listar webhooks", description = "Retorna a lista de todos os webhooks cadastrados")
    @APIResponse(responseCode = "200", description = "Lista de webhooks", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response listWebhooks() {
        return superfreteService.listWebhooks();
    }

    @PUT
    @Path("/webhooks/{webhookId}")
    @Operation(summary = "Atualizar webhook", description = "Atualiza as informações de um webhook existente")
    @APIResponse(responseCode = "200", description = "Webhook atualizado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "404", description = "Webhook não encontrado")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response updateWebhook(@PathParam("webhookId") String webhookId, WebhookRequest request) {
        return superfreteService.updateWebhook(webhookId, request);
    }

    @DELETE
    @Path("/webhooks/{webhookId}")
    @Operation(summary = "Deletar webhook", description = "Remove um webhook cadastrado")
    @APIResponse(responseCode = "200", description = "Webhook deletado com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "404", description = "Webhook não encontrado")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response deleteWebhook(@PathParam("webhookId") String webhookId) {
        return superfreteService.deleteWebhook(webhookId);
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

