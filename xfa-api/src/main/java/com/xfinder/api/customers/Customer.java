package com.xfinder.api.customers;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer extends PanacheEntity { // Já herda 'id' auto-increment do PanacheEntity

    @Column(nullable = false, length = 200)
    public String name;

    @Column(nullable = false, unique = true, length = 200)
    public String email;

    @Column(nullable = false, length = 20)
    public String phone;

    @Column(nullable = false, unique = true, length = 14)
    public String cpf;

    @Column(nullable = false, length = 9)
    public String cep;

    @Column(nullable = false, length = 300)
    public String address;

    @Column(nullable = false, length = 20)
    public String number;

    @Column(length = 100)
    public String complement;

    @Column(nullable = false, length = 100)
    public String neighborhood;

    @Column(nullable = false, length = 100)
    public String city;

    @Column(nullable = false, length = 2)
    public String state;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @Column(name = "active")
    public Boolean active = true;

    @Column(name = "keycloak_id", length = 100)
    public String keycloakId;

    @Column(name = "accepts_promotional_emails")
    public Boolean acceptsPromotionalEmails = false;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Construtores
    public Customer() {}

    public Customer(String name, String email, String phone, String cpf,
                    String cep, String address, String number, String complement,
                    String neighborhood, String city, String state) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cpf = cpf;
        this.cep = cep;
        this.address = address;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
    }
}