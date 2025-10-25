package com.xfinder.api.orders;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Orders", description = "API para gerenciamento de pedidos")
public class OrderResource {

    @Inject
    OrderService orderService;

    @GET
    @Operation(summary = "Listar pedidos", description = "Retorna todos os pedidos de forma paginada")
    @APIResponse(responseCode = "200", description = "Lista de pedidos",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderDTO.class)))
    public List<OrderDTO> getOrders(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit) {

        return orderService.getOrdersPaginated(page, limit);
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Buscar pedido por ID", description = "Retorna um pedido específico pelo seu ID")
    public Response getOrderById(@PathParam("id") Long id) {
        Optional<OrderDTO> order = orderService.getOrderById(id);

        if (order.isPresent()) {
            return Response.ok(order.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Pedido não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/customer/{customerId}")
    @Operation(summary = "Buscar pedidos por cliente", description = "Retorna pedidos filtrados por ID do cliente")
    public List<OrderDTO> getOrdersByCustomer(@PathParam("customerId") Long customerId) {
        return orderService.getOrdersByCustomer(customerId);
    }

    @GET
    @Path("/status/{status}")
    @Operation(summary = "Buscar pedidos por status", description = "Retorna pedidos filtrados por status")
    public List<OrderDTO> getOrdersByStatus(@PathParam("status") String status) {
        return orderService.getOrdersByStatus(status);
    }

    @GET
    @Path("/count")
    @Operation(summary = "Contar pedidos", description = "Retorna o total de pedidos")
    public Response countOrders() {
        long count = orderService.countOrders();
        return Response.ok("{\"count\": " + count + "}").build();
    }

    @GET
    @Path("/count/status/{status}")
    @Operation(summary = "Contar pedidos por status", description = "Retorna o total de pedidos com determinado status")
    public Response countOrdersByStatus(@PathParam("status") String status) {
        long count = orderService.countOrdersByStatus(status);
        return Response.ok("{\"count\": " + count + "}").build();
    }

    @POST
    @Transactional
    @Operation(summary = "Criar pedido", description = "Cria um novo pedido e atualiza o estoque")
    public Response createOrder(OrderDTO orderDTO) {
        try {
            OrderDTO createdOrder = orderService.createOrder(orderDTO);
            return Response.status(Response.Status.CREATED)
                    .entity(createdOrder)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao criar pedido: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Atualizar pedido", description = "Atualiza os dados do pedido (principalmente dados de pagamento)")
    public Response updateOrder(@PathParam("id") Long id, OrderDTO orderDTO) {
        try {
            OrderDTO updatedOrder = orderService.updateOrder(id, orderDTO);
            return Response.ok(updatedOrder).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Pedido não encontrado\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao atualizar pedido: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}/status")
    @Transactional
    @Operation(summary = "Atualizar status do pedido", description = "Atualiza apenas o status do pedido")
    public Response updateOrderStatus(
            @PathParam("id") Long id,
            @QueryParam("status") String status) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
            return Response.ok(updatedOrder).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Pedido não encontrado\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao atualizar status: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}/cancel")
    @Transactional
    @Operation(summary = "Cancelar pedido", description = "Cancela o pedido e restaura o estoque")
    public Response cancelOrder(@PathParam("id") Long id) {
        try {
            OrderDTO cancelledOrder = orderService.cancelOrder(id);
            return Response.ok(cancelledOrder).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Pedido não encontrado\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao cancelar pedido: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Deletar pedido", description = "Remove um pedido do sistema")
    public Response deleteOrder(@PathParam("id") Long id) {
        try {
            orderService.deleteOrder(id);
            return Response.noContent().build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Pedido não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Orders funcionando!\"}").build();
    }
}
