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

    @POST
    @Path("/calculator")
    Response calculateFreight(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        SuperfreteCalculationRequest request
    );

    @POST
    @Path("/cart")
    Response createLabel(
        @HeaderParam("Authorization") String authorization,
        @HeaderParam("User-Agent") String userAgent,
        LabelCreationRequest request
    );
}

