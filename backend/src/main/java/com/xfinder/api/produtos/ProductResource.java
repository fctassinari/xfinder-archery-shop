package com.xfinder.api.produtos;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Products", description = "API para gerenciamento de produtos XFinder Archery")
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    @Operation(summary = "Listar produtos", description = "Retorna todos os produtos ou de forma paginada")
    @APIResponse(responseCode = "200", description = "Lista de produtos",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    public List<Product> getProducts(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("6") int limit) {

        return productService.getProductsPaginated(page, limit);
    }

    @GET
    @Path("/{id}")
    public Response getProductById(@PathParam("id") String id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            return Response.ok(product.get()).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Produto não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/category/{category}")
    public List<Product> getProductsByCategory(@PathParam("category") String category) {
        return productService.getProductsByCategory(category);
    }

    @GET
    @Path("/featured")
    public List<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @GET
    @Path("/health")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Products funcionando!\"}").build();
    }
}