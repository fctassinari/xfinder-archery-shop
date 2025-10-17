package com.xfinder.api.superfrete;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class FreightCalculationRequest {
    
    @JsonProperty("cep")
    private String cep;
    
    @JsonProperty("products")
    private List<ProductItem> products;
    
    @JsonProperty("insurance_value")
    private Double insuranceValue;
    
    @JsonProperty("use_insurance_value")
    private Boolean useInsuranceValue;

    // Construtor padrão
    public FreightCalculationRequest() {}

    // Getters e Setters
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public List<ProductItem> getProducts() { return products; }
    public void setProducts(List<ProductItem> products) { this.products = products; }

    public Double getInsuranceValue() { return insuranceValue; }
    public void setInsuranceValue(Double insuranceValue) { this.insuranceValue = insuranceValue; }

    public Boolean getUseInsuranceValue() { return useInsuranceValue; }
    public void setUseInsuranceValue(Boolean useInsuranceValue) { this.useInsuranceValue = useInsuranceValue; }

    // Classe interna para itens do produto
    public static class ProductItem {
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("quantity")
        private Integer quantity;
        
        @JsonProperty("unitary_value")
        private Double unitaryValue;
        
        @JsonProperty("weight")
        private Double weight;
        
        @JsonProperty("height")
        private Double height;
        
        @JsonProperty("width")
        private Double width;
        
        @JsonProperty("length")
        private Double length;

        // Construtor padrão
        public ProductItem() {}

        // Getters e Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getUnitaryValue() { return unitaryValue; }
        public void setUnitaryValue(Double unitaryValue) { this.unitaryValue = unitaryValue; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }

        public Double getHeight() { return height; }
        public void setHeight(Double height) { this.height = height; }

        public Double getWidth() { return width; }
        public void setWidth(Double width) { this.width = width; }

        public Double getLength() { return length; }
        public void setLength(Double length) { this.length = length; }
    }
}

