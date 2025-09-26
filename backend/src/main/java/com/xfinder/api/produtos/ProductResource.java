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
    @Operation(summary = "Listar todos os produtos", description = "Retorna uma lista com todos os produtos disponíveis")
    @APIResponse(responseCode = "200", description = "Lista de produtos",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico pelo seu ID")
    @APIResponse(responseCode = "200", description = "Produto encontrado",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    @APIResponse(responseCode = "404", description = "Produto não encontrado")
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
    @Operation(summary = "Buscar produtos por categoria", description = "Retorna produtos de uma categoria específica")
    @APIResponse(responseCode = "200", description = "Lista de produtos da categoria",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    public List<Product> getProductsByCategory(@PathParam("category") String category) {
        return productService.getProductsByCategory(category);
    }

    @GET
    @Path("/featured")
    @Operation(summary = "Buscar produtos em destaque", description = "Retorna produtos marcados como novos ou em destaque")
    @APIResponse(responseCode = "200", description = "Lista de produtos em destaque",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    public List<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    @APIResponse(responseCode = "200", description = "API funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Products funcionando!\", \"timestamp\": \"" +
                java.time.LocalDateTime.now() + "\"}").build();
    }
}