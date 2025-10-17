package com.xfinder.api.superfrete;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LabelCreationRequest {
    
    @JsonProperty("from")
    private AddressInfo from;
    
    @JsonProperty("to")
    private AddressInfo to;
    
    @JsonProperty("service")
    private String service;
    
    @JsonProperty("volume")
    private VolumeInfo volume;

    // Construtor padrão
    public LabelCreationRequest() {}

    // Getters e Setters
    public AddressInfo getFrom() { return from; }
    public void setFrom(AddressInfo from) { this.from = from; }

    public AddressInfo getTo() { return to; }
    public void setTo(AddressInfo to) { this.to = to; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public VolumeInfo getVolume() { return volume; }
    public void setVolume(VolumeInfo volume) { this.volume = volume; }

    // Classe para informações de endereço
    public static class AddressInfo {
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("phone")
        private String phone;
        
        @JsonProperty("email")
        private String email;
        
        @JsonProperty("document")
        private String document;
        
        @JsonProperty("company_document")
        private String companyDocument;
        
        @JsonProperty("state_register")
        private String stateRegister;
        
        @JsonProperty("postal_code")
        private String postalCode;
        
        @JsonProperty("address")
        private String address;
        
        @JsonProperty("location_number")
        private String locationNumber;
        
        @JsonProperty("complement")
        private String complement;
        
        @JsonProperty("district")
        private String district;
        
        @JsonProperty("city")
        private String city;
        
        @JsonProperty("state_abbr")
        private String stateAbbr;
        
        @JsonProperty("country_id")
        private String countryId;

        // Construtor padrão
        public AddressInfo() {}

        // Getters e Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getDocument() { return document; }
        public void setDocument(String document) { this.document = document; }

        public String getCompanyDocument() { return companyDocument; }
        public void setCompanyDocument(String companyDocument) { this.companyDocument = companyDocument; }

        public String getStateRegister() { return stateRegister; }
        public void setStateRegister(String stateRegister) { this.stateRegister = stateRegister; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getLocationNumber() { return locationNumber; }
        public void setLocationNumber(String locationNumber) { this.locationNumber = locationNumber; }

        public String getComplement() { return complement; }
        public void setComplement(String complement) { this.complement = complement; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getStateAbbr() { return stateAbbr; }
        public void setStateAbbr(String stateAbbr) { this.stateAbbr = stateAbbr; }

        public String getCountryId() { return countryId; }
        public void setCountryId(String countryId) { this.countryId = countryId; }
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

        // Construtor padrão
        public VolumeInfo() {}

        // Getters e Setters
        public Double getHeight() { return height; }
        public void setHeight(Double height) { this.height = height; }

        public Double getWidth() { return width; }
        public void setWidth(Double width) { this.width = width; }

        public Double getLength() { return length; }
        public void setLength(Double length) { this.length = length; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
    }
}

