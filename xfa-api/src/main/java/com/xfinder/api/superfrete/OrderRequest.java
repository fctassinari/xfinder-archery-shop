package com.xfinder.api.superfrete;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class OrderRequest {
    
    @JsonProperty("from")
    private AddressInfo from;
    
    @JsonProperty("to")
    private AddressInfo to;
    
    @JsonProperty("service")
    private String service;
    
    @JsonProperty("products")
    private List<ProductInfo> products;
    
    @JsonProperty("volumes")
    private VolumeInfo volume;
    
    @JsonProperty("options")
    private OrderOptions options;
    
    @JsonProperty("tag")
    private String tag;
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("platform")
    private String platform;

    // Construtor padrão
    public OrderRequest() {}

    // Getters e Setters
    public AddressInfo getFrom() { return from; }
    public void setFrom(AddressInfo from) { this.from = from; }

    public AddressInfo getTo() { return to; }
    public void setTo(AddressInfo to) { this.to = to; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public List<ProductInfo> getProducts() { return products; }
    public void setProducts(List<ProductInfo> products) { this.products = products; }

    public VolumeInfo getVolume() { return volume; }
    public void setVolume(VolumeInfo volume) { this.volume = volume; }

    public OrderOptions getOptions() { return options; }
    public void setOptions(OrderOptions options) { this.options = options; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    // Classe para informações de endereço (reutilizando estrutura similar)
    public static class AddressInfo {
        @JsonProperty("name")
        private String name;
        
//        @JsonProperty("phone")
//        private String phone;
        
//        @JsonProperty("email")
//        private String email;
        
//        @JsonProperty("document")
//        private String document;
        
//        @JsonProperty("company_document")
//        private String companyDocument;
        
//        @JsonProperty("state_register")
//        private String stateRegister;
        
        @JsonProperty("postal_code")
        private String postalCode;
        
        @JsonProperty("address")
        private String address;
        
        @JsonProperty("number")
        private String number;
        
//        @JsonProperty("location_number")
//        private String locationNumber;
        
        @JsonProperty("complement")
        private String complement;
        
        @JsonProperty("district")
        private String district;
        
        @JsonProperty("city")
        private String city;
        
        @JsonProperty("state_abbr")
        private String stateAbbr;
        
//        @JsonProperty("country_id")
//        private String countryId;

        public AddressInfo() {}

        // Getters e Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

//        public String getPhone() { return phone; }
//        public void setPhone(String phone) { this.phone = phone; }

//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }

//        public String getDocument() { return document; }
//        public void setDocument(String document) { this.document = document; }

//        public String getCompanyDocument() { return companyDocument; }
//        public void setCompanyDocument(String companyDocument) { this.companyDocument = companyDocument; }

//        public String getStateRegister() { return stateRegister; }
//        public void setStateRegister(String stateRegister) { this.stateRegister = stateRegister; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getNumber() { 
            return number;
        }
        public void setNumber(String number) { this.number = number; }

//        public String getLocationNumber() { return locationNumber; }
//        public void setLocationNumber(String locationNumber) {
//            this.locationNumber = locationNumber;
//            // Se number não estiver definido, usa locationNumber
//            if (this.number == null) {
//                this.number = locationNumber;
//            }
//        }

        public String getComplement() { return complement; }
        public void setComplement(String complement) { this.complement = complement; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getStateAbbr() { return stateAbbr; }
        public void setStateAbbr(String stateAbbr) { this.stateAbbr = stateAbbr; }

//        public String getCountryId() { return countryId; }
//        public void setCountryId(String countryId) { this.countryId = countryId; }
    }

    // Classe para informações de produto
    public static class ProductInfo {
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("quantity")
        private Integer quantity;
        
        @JsonProperty("unitary_value")
        private Double unitaryValue;

        public ProductInfo() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getUnitaryValue() { return unitaryValue; }
        public void setUnitaryValue(Double unitaryValue) { this.unitaryValue = unitaryValue; }
    }

    // Classe para informações de volume
    public static class VolumeInfo {
        @JsonProperty("height")
        private Double height;
        
        @JsonProperty("width")
        private Double width;
        
        @JsonProperty("length")
        private Double length;
        
        @JsonProperty("weight")
        private Double weight;

        public VolumeInfo() {}

        public Double getHeight() { return height; }
        public void setHeight(Double height) { this.height = height; }

        public Double getWidth() { return width; }
        public void setWidth(Double width) { this.width = width; }

        public Double getLength() { return length; }
        public void setLength(Double length) { this.length = length; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
    }

    // Classe para opções do pedido
    public static class OrderOptions {
        @JsonProperty("insurance_value")
        private Double insuranceValue;
        
        @JsonProperty("receipt")
        private Boolean receipt;
        
        @JsonProperty("own_hand")
        private Boolean ownHand;
        
        @JsonProperty("non_commercial")
        private Boolean nonCommercial;
        
        @JsonProperty("invoice")
        private InvoiceInfo invoice;

        public OrderOptions() {}

        public Double getInsuranceValue() { return insuranceValue; }
        public void setInsuranceValue(Double insuranceValue) { this.insuranceValue = insuranceValue; }

        public Boolean getReceipt() { return receipt; }
        public void setReceipt(Boolean receipt) { this.receipt = receipt; }

        public Boolean getOwnHand() { return ownHand; }
        public void setOwnHand(Boolean ownHand) { this.ownHand = ownHand; }

        public Boolean getNonCommercial() { return nonCommercial; }
        public void setNonCommercial(Boolean nonCommercial) { this.nonCommercial = nonCommercial; }

        public InvoiceInfo getInvoice() { return invoice; }
        public void setInvoice(InvoiceInfo invoice) { this.invoice = invoice; }

        // Classe para informações de nota fiscal
        public static class InvoiceInfo {
            @JsonProperty("number")
            private String number;
            
            @JsonProperty("key")
            private String key;

            public InvoiceInfo() {}

            public String getNumber() { return number; }
            public void setNumber(String number) { this.number = number; }

            public String getKey() { return key; }
            public void setKey(String key) { this.key = key; }
        }
    }
}

