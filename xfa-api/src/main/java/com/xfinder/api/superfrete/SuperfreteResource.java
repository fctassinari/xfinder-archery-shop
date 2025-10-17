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

    @POST
    @Path("/create-label")
    @Operation(summary = "Criar etiqueta", description = "Cria uma etiqueta de envio para o pedido")
    @APIResponse(responseCode = "200", description = "Etiqueta criada com sucesso", 
                 content = @Content(mediaType = "application/json"))
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "500", description = "Erro interno do servidor")
    public Response createLabel(LabelCreationRequest request) {
        return superfreteService.createLabel(request);
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Verifica se a API Superfrete está funcionando")
    @APIResponse(responseCode = "200", description = "API funcionando")
    public Response healthCheck() {
        return Response.ok("{\"status\": \"API Superfrete funcionando!\", \"timestamp\": \"" + 
                          java.time.LocalDateTime.now() + "\"}").build();
    }
}

