package com.xfinder.api.customers;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/api/customers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Customers", description = "API para gerenciamento de clientes")
public class CustomerResource {

    @Inject
    CustomerService customerService;

    @GET
    @RolesAllowed({"admin"})
    @Operation(summary = "Listar clientes", description = "Retorna todos os clientes de forma paginada")
    @APIResponse(responseCode = "200", description = "Lista de clientes",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomerDTO.class)))
    public List<CustomerDTO> getCustomers(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("10") int limit) {

        return customerService.getCustomersPaginated(page, limit);
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Buscar cliente por ID", description = "Retorna um cliente específico pelo seu ID")
    public Response getCustomerById(@PathParam("id") Long id) {
        Optional<CustomerDTO> customer = customerService.getCustomerById(id);

        if (customer.isPresent()) {
            return Response.ok(customer.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Cliente não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/email/{email}")
    @Operation(summary = "Buscar cliente por e-mail", description = "Retorna um cliente pelo e-mail")
    public Response getCustomerByEmail(@PathParam("email") String email) {
        Optional<CustomerDTO> customer = customerService.getCustomerByEmail(email);

        if (customer.isPresent()) {
            return Response.ok(customer.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Cliente não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/cpf/{cpf}")
    @Operation(summary = "Buscar cliente por CPF", description = "Retorna um cliente pelo CPF")
    public Response getCustomerByCpf(@PathParam("cpf") String cpf) {
        Optional<CustomerDTO> customer = customerService.getCustomerByCpf(cpf);

        if (customer.isPresent()) {
            return Response.ok(customer.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Cliente não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/city/{city}")
    @Operation(summary = "Buscar clientes por cidade", description = "Retorna clientes filtrados por cidade")
    public List<CustomerDTO> getCustomersByCity(@PathParam("city") String city) {
        return customerService.getCustomersByCity(city);
    }

    @GET
    @Path("/state/{state}")
    @Operation(summary = "Buscar clientes por estado", description = "Retorna clientes filtrados por estado")
    public List<CustomerDTO> getCustomersByState(@PathParam("state") String state) {
        return customerService.getCustomersByState(state);
    }

    @GET
    @Path("/count")
    @Operation(summary = "Contar clientes ativos", description = "Retorna o total de clientes ativos")
    public Response countActiveCustomers() {
        long count = customerService.countActiveCustomers();
        return Response.ok("{\"count\": " + count + "}").build();
    }

    @POST
    @Transactional
    @Operation(summary = "Criar cliente", description = "Cria um novo cliente")
    public Response createCustomer(CustomerDTO customerDTO) {
        try {
            CustomerDTO createdCustomer = customerService.createCustomer(customerDTO);
            return Response.status(Response.Status.CREATED)
                    .entity(createdCustomer)
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao criar cliente: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"customer", "admin"})
    @Transactional
    @Operation(summary = "Atualizar cliente", description = "Atualiza um cliente existente")
    public Response updateCustomer(@PathParam("id") Long id, CustomerDTO customerDTO) {
        try {
            CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
            return Response.ok(updatedCustomer).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Cliente não encontrado\"}")
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao atualizar cliente: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"customer", "admin"})
    @Transactional
    @Operation(summary = "Deletar cliente", description = "Remove um cliente do sistema (soft delete)")
    public Response deleteCustomer(@PathParam("id") Long id) {
        try {
            customerService.deleteCustomer(id);
            return Response.noContent().build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Cliente não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Customers funcionando!\"}").build();
    }
}