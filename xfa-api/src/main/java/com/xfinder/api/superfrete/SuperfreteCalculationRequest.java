package com.xfinder.api.superfrete;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class SuperfreteCalculationRequest {
    
    @JsonProperty("from")
    private PostalCodeInfo from;
    
    @JsonProperty("to")
    private PostalCodeInfo to;
    
    @JsonProperty("services")
    private String services;
    
    @JsonProperty("products")
    private List<FreightCalculationRequest.ProductItem> products;
    
    @JsonProperty("options")
    private OptionsInfo options;

    // Construtor padrão
    public SuperfreteCalculationRequest() {}

    // Getters e Setters
    public PostalCodeInfo getFrom() { return from; }
    public void setFrom(PostalCodeInfo from) { this.from = from; }

    public PostalCodeInfo getTo() { return to; }
    public void setTo(PostalCodeInfo to) { this.to = to; }

    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }

    public List<FreightCalculationRequest.ProductItem> getProducts() { return products; }
    public void setProducts(List<FreightCalculationRequest.ProductItem> products) { this.products = products; }

    public OptionsInfo getOptions() { return options; }
    public void setOptions(OptionsInfo options) { this.options = options; }

    // Classe para informações de CEP
    public static class PostalCodeInfo {
        @JsonProperty("postal_code")
        private String postalCode;

        public PostalCodeInfo() {}

        public PostalCodeInfo(String postalCode) {
            this.postalCode = postalCode;
        }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    }

    // Classe para opções de envio
    public static class OptionsInfo {
        @JsonProperty("own_hand")
        private Boolean ownHand;
        
        @JsonProperty("receipt")
        private Boolean receipt;
        
        @JsonProperty("insurance_value")
        private Double insuranceValue;

        @JsonProperty("use_insurance_value")
        private Boolean useInsuranceValue;

        public OptionsInfo() {}

        // Getters e Setters
        public Boolean getOwnHand() { return ownHand; }
        public void setOwnHand(Boolean ownHand) { this.ownHand = ownHand; }

        public Boolean getReceipt() { return receipt; }
        public void setReceipt(Boolean receipt) { this.receipt = receipt; }

        public Double getInsuranceValue() { return insuranceValue; }
        public void setInsuranceValue(Double insuranceValue) { this.insuranceValue = insuranceValue; }

        public Boolean getUseInsuranceValue() { return useInsuranceValue; }
        public void setUseInsuranceValue(Boolean useInsuranceValue) { this.useInsuranceValue = useInsuranceValue; }
    }
}

