package com.xfinder.api.auth;

import com.xfinder.api.customers.Customer;
import com.xfinder.api.customers.CustomerDTO;
import com.xfinder.api.customers.CustomerService;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Optional;

@ApplicationScoped
public class KeycloakSyncService {

    @Inject
    CustomerService customerService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    /**
     * Sincroniza ou cria um Customer baseado nos dados do token JWT do Keycloak.
     * Usa o email como identificador único.
     */
    @Transactional
    public CustomerDTO syncCustomerFromKeycloak() {
        if (!securityIdentity.isAnonymous()) {
            String email = getEmailFromToken();
            String keycloakId = getKeycloakIdFromToken();
            String name = getNameFromToken();

            if (email == null || email.isEmpty()) {
                throw new IllegalStateException("Email não encontrado no token JWT");
            }

            // Buscar Customer existente por email OU keycloakId
            Optional<CustomerDTO> existingCustomerByEmail = customerService.getCustomerByEmail(email);
            Optional<Customer> existingCustomerByKeycloakId = Optional.empty();
            
            if (keycloakId != null && !keycloakId.isEmpty()) {
                existingCustomerByKeycloakId = Customer.find("keycloakId", keycloakId).firstResultOptional();
            }

            // Se encontrou por email ou keycloakId, atualizar
            if (existingCustomerByEmail.isPresent()) {
                Customer customer = Customer.findById(existingCustomerByEmail.get().id);
                if (customer != null) {
                    // Atualizar keycloakId se ainda não tiver
                    if (keycloakId != null && !keycloakId.isEmpty() && 
                        (customer.keycloakId == null || customer.keycloakId.isEmpty())) {
                        customer.keycloakId = keycloakId;
                        customer.persist();
                    }
                    // Atualizar nome se mudou
                    if (name != null && !name.isEmpty() && !name.equals(customer.name)) {
                        customer.name = name;
                        customer.persist();
                    }
                    return customerService.toDTO(customer);
                }
                return existingCustomerByEmail.get();
            } else if (existingCustomerByKeycloakId.isPresent()) {
                // Se encontrou por keycloakId mas não por email, atualizar email
                Customer customer = existingCustomerByKeycloakId.get();
                if (!email.equals(customer.email)) {
                    customer.email = email;
                }
                if (name != null && !name.isEmpty() && !name.equals(customer.name)) {
                    customer.name = name;
                }
                customer.persist();
                return customerService.toDTO(customer);
            } else {
                // Criar novo Customer se não existir
                // Nota: Dados mínimos serão criados, o usuário precisará completar o cadastro
                Customer customer = new Customer();
                customer.email = email;
                customer.name = name != null && !name.isEmpty() ? name : email.split("@")[0];
                customer.keycloakId = keycloakId;
                customer.active = true;
                
                // Campos obrigatórios com valores padrão temporários
                // IMPORTANTE: Usar valores únicos temporários para evitar constraint violations
                customer.phone = "00000000000"; // Valor temporário
                
                // CPF: gerar valor único temporário baseado no keycloakId ou email
                // O CPF tem constraint unique, então precisamos de um valor único temporário
                String tempCpf;
                if (keycloakId != null && !keycloakId.isEmpty()) {
                    // Usar hash do keycloakId para gerar CPF temporário único
                    int hash = keycloakId.hashCode();
                    // Garantir que seja positivo e tenha 11 dígitos
                    tempCpf = String.format("%011d", Math.abs(hash) % 99999999999L);
                } else {
                    // Se não tiver keycloakId, usar hash do email
                    int hash = email.hashCode();
                    tempCpf = String.format("%011d", Math.abs(hash) % 99999999999L);
                }
                
                // Verificar se já existe Customer com este CPF temporário
                // Se existir, adicionar timestamp para garantir unicidade
                Optional<Customer> existingCpf = Customer.find("cpf = ?1", tempCpf).firstResultOptional();
                if (existingCpf.isPresent()) {
                    // Adicionar timestamp para garantir unicidade
                    long timestamp = System.currentTimeMillis() % 1000000000L; // Últimos 9 dígitos
                    tempCpf = String.format("%011d", (Math.abs(keycloakId != null ? keycloakId.hashCode() : email.hashCode()) + timestamp) % 99999999999L);
                }
                customer.cpf = tempCpf;
                
                customer.cep = "00000000";
                customer.address = "A definir";
                customer.number = "0";
                customer.neighborhood = "A definir";
                customer.city = "A definir";
                customer.state = "SP";

                customer.persist();

                return customerService.toDTO(customer);
            }
        }
        throw new IllegalStateException("Usuário não autenticado");
    }

    /**
     * Obtém o Customer vinculado ao usuário autenticado.
     */
    public Optional<CustomerDTO> getCurrentCustomer() {
        if (securityIdentity.isAnonymous()) {
            return Optional.empty();
        }

        String email = getEmailFromToken();
        if (email == null || email.isEmpty()) {
            return Optional.empty();
        }

        return customerService.getCustomerByEmail(email);
    }

    /**
     * Obtém o email do token JWT.
     */
    private String getEmailFromToken() {
        // Tentar obter email de diferentes claims
        String email = jwt.getClaim("email");
        if (email == null || email.isEmpty()) {
            email = jwt.getClaim("preferred_username");
        }
        return email;
    }

    /**
     * Obtém o ID do Keycloak (subject) do token JWT.
     */
    private String getKeycloakIdFromToken() {
        return jwt.getSubject();
    }

    /**
     * Obtém o nome do token JWT.
     */
    private String getNameFromToken() {
        String name = jwt.getClaim("name");
        if (name == null || name.isEmpty()) {
            String givenName = jwt.getClaim("given_name");
            String familyName = jwt.getClaim("family_name");
            if (givenName != null || familyName != null) {
                name = (givenName != null ? givenName : "") + " " + (familyName != null ? familyName : "");
                name = name.trim();
            }
        }
        return name;
    }

    /**
     * Verifica se o usuário autenticado tem uma role específica.
     */
    public boolean hasRole(String role) {
        return securityIdentity.hasRole(role);
    }

    /**
     * Obtém o ID do Keycloak do usuário autenticado.
     */
    public String getCurrentKeycloakId() {
        if (securityIdentity.isAnonymous()) {
            return null;
        }
        return jwt.getSubject();
    }

}

