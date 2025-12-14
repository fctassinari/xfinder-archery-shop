package com.xfinder.api.produtos;

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
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductDTO.class)))
    public List<ProductDTO> getProducts(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("6") int limit) {

        return productService.getProductsPaginated(page, limit);
    }

    @GET
    @Path("/with-variants")
    @Operation(summary = "Listar produtos com variantes", description = "Retorna apenas produtos que possuem variantes")
    public List<ProductDTO> getProductsWithVariants(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("limit") @DefaultValue("6") int limit) {

        return productService.getProductsWithVariantsPaginated(page, limit);
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico pelo seu ID")
    public Response getProductById(@PathParam("id") Long id) {
        Optional<ProductDTO> product = productService.getProductById(id);

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
    @Operation(summary = "Buscar produtos por categoria", description = "Retorna produtos filtrados por categoria")
    public List<ProductDTO> getProductsByCategory(@PathParam("category") String category) {
        return productService.getProductsByCategory(category);
    }

    @GET
    @Path("/featured")
    @Operation(summary = "Produtos em destaque", description = "Retorna produtos em destaque")
    public List<ProductDTO> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    @POST
    @Transactional
    @Operation(summary = "Criar produto", description = "Cria um novo produto")
    public Response createProduct(ProductDTO productDTO) {
        try {
            ProductDTO createdProduct = productService.createProduct(productDTO);
            return Response.status(Response.Status.CREATED)
                    .entity(createdProduct)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao criar produto: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Atualizar produto", description = "Atualiza um produto existente")
    public Response updateProduct(@PathParam("id") Long id, ProductDTO productDTO) {
        try {
            ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
            return Response.ok(updatedProduct).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Produto não encontrado\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Erro ao atualizar produto: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Deletar produto", description = "Remove um produto do sistema")
    public Response deleteProduct(@PathParam("id") Long id) {
        try {
            productService.deleteProduct(id);
            return Response.noContent().build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Produto não encontrado\"}")
                    .build();
        }
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Products funcionando!\"}").build();
    }
}