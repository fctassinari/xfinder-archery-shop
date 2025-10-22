package com.xfinder.api.customers;

import java.time.LocalDateTime;

public class CustomerDTO {
    public Long id;
    public String name;
    public String email;
    public String phone;
    public String cpf;
    public String cep;
    public String address;
    public String number;
    public String complement;
    public String neighborhood;
    public String city;
    public String state;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public Boolean active;

    public CustomerDTO() {}
}