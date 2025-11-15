package com.xfinder.api.superfrete;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class WebhookRequest {
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("events")
    private List<String> events;

    // Construtor padrão
    public WebhookRequest() {}

    // Getters e Setters
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public List<String> getEvents() { return events; }
    public void setEvents(List<String> events) { this.events = events; }
}

