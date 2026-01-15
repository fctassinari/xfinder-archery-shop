package com.xfinder.api.customers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class CustomerService {

    // Listar clientes com paginação
    public List<CustomerDTO> getCustomersPaginated(int page, int limit) {
        int offset = (page - 1) * limit;

        List<Customer> customers = Customer.find("active = true ORDER BY createdAt DESC")
                .range(offset, offset + limit - 1)
                .list();

        return customers.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar cliente por ID
    public Optional<CustomerDTO> getCustomerById(Long id) {
        Customer customer = Customer.findById(id);
        if (customer == null || !customer.active) {
            return Optional.empty();
        }
        return Optional.of(toDTO(customer));
    }

    // Buscar cliente por email
    public Optional<CustomerDTO> getCustomerByEmail(String email) {
        Customer customer = Customer.find("email = ?1 AND active = true", email).firstResult();
        if (customer == null) {
            return Optional.empty();
        }
        return Optional.of(toDTO(customer));
    }

    // Buscar cliente por CPF
    public Optional<CustomerDTO> getCustomerByCpf(String cpf) {
        String cleanCpf = cpf.replaceAll("[^0-9]", "");
        Customer customer = Customer.find("cpf = ?1 AND active = true", cleanCpf).firstResult();
        if (customer == null) {
            return Optional.empty();
        }
        return Optional.of(toDTO(customer));
    }

    // Criar cliente
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        // Validar campos obrigatórios
        validateRequiredFields(customerDTO, true);

        // Limpar CPF e CEP (remover caracteres especiais)
        if (customerDTO.cpf != null) {
            customerDTO.cpf = customerDTO.cpf.replaceAll("[^0-9]", "");
        }
        if (customerDTO.cep != null) {
            customerDTO.cep = customerDTO.cep.replaceAll("[^0-9]", "");
        }
        if (customerDTO.phone != null) {
            customerDTO.phone = customerDTO.phone.replaceAll("[^0-9]", "");
        }

        // Verificar se já existe cliente com mesmo email (apenas se email não for null)
        if (customerDTO.email != null && !customerDTO.email.isEmpty()) {
            Optional<Customer> existingEmail = Customer.find("email = ?1 AND active = true", customerDTO.email)
                    .firstResultOptional();
            if (existingEmail.isPresent()) {
                throw new IllegalArgumentException("Já existe um cliente com este e-mail");
            }
        }

        // Verificar se já existe cliente com mesmo CPF (apenas se CPF não for null)
        if (customerDTO.cpf != null && !customerDTO.cpf.isEmpty()) {
            Optional<Customer> existingCpf = Customer.find("cpf = ?1 AND active = true", customerDTO.cpf)
                    .firstResultOptional();
            if (existingCpf.isPresent()) {
                throw new IllegalArgumentException("Já existe um cliente com este CPF");
            }
        }

        Customer customer = fromDTO(customerDTO);
        customer.persist();

        return toDTO(customer);
    }

    // Atualizar cliente
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = Customer.findById(id);
        if (customer == null) {
            throw new NotFoundException("Cliente não encontrado");
        }

        // Se o cliente está inativo (anonimizado), não permitir atualização
        if (!customer.active) {
            throw new IllegalArgumentException("Não é possível atualizar dados de um cliente com dados anonimizados");
        }

        // Validar campos obrigatórios apenas se active = true
        validateRequiredFields(customerDTO, true);

        // Limpar CPF e CEP
        if (customerDTO.cpf != null) {
            customerDTO.cpf = customerDTO.cpf.replaceAll("[^0-9]", "");
        }
        if (customerDTO.cep != null) {
            customerDTO.cep = customerDTO.cep.replaceAll("[^0-9]", "");
        }
        if (customerDTO.phone != null) {
            customerDTO.phone = customerDTO.phone.replaceAll("[^0-9]", "");
        }

        // Verificar se o email já está sendo usado por outro cliente (apenas se email não for null)
        if (customerDTO.email != null && !customerDTO.email.isEmpty()) {
            Optional<Customer> existingEmail = Customer.find("email = ?1 AND id != ?2 AND active = true",
                            customerDTO.email, id)
                    .firstResultOptional();
            if (existingEmail.isPresent()) {
                throw new IllegalArgumentException("Este e-mail já está sendo usado por outro cliente");
            }
        }

        // Verificar se o CPF já está sendo usado por outro cliente (apenas se CPF não for null)
        if (customerDTO.cpf != null && !customerDTO.cpf.isEmpty()) {
            Optional<Customer> existingCpf = Customer.find("cpf = ?1 AND id != ?2 AND active = true",
                            customerDTO.cpf, id)
                    .firstResultOptional();
            if (existingCpf.isPresent()) {
                throw new IllegalArgumentException("Este CPF já está sendo usado por outro cliente");
            }
        }

        updateFromDTO(customer, customerDTO);

        return toDTO(customer);
    }

    // Deletar cliente (soft delete)
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = Customer.findById(id);
        if (customer == null) {
            throw new NotFoundException("Cliente não encontrado");
        }

        customer.active = false;
        customer.persist();
    }

    // Anonimizar dados do cliente (LGPD)
    @Transactional
    public void anonymizeCustomerData(Long id) {
        Customer customer = Customer.findById(id);
        if (customer == null) {
            throw new NotFoundException("Cliente não encontrado");
        }

        // Limpar todos os campos pessoais
        customer.name = null;
        customer.email = null;
        customer.phone = null;
        customer.cpf = null;
        customer.cep = null;
        customer.address = null;
        customer.number = null;
        customer.complement = null;
        customer.neighborhood = null;
        customer.city = null;
        customer.state = null;
        customer.acceptsPromotionalEmails = false;
        
        // Remover keycloakId após exclusão do Keycloak
        customer.keycloakId = null;
        
        // Marcar como inativo
        customer.active = false;
        
        // Atualizar timestamp
        customer.updatedAt = java.time.LocalDateTime.now();
        
        customer.persist();
    }

    // Buscar clientes por cidade
    public List<CustomerDTO> getCustomersByCity(String city) {
        List<Customer> customers = Customer.find("city = ?1 AND active = true", city).list();
        return customers.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar clientes por estado
    public List<CustomerDTO> getCustomersByState(String state) {
        List<Customer> customers = Customer.find("state = ?1 AND active = true", state.toUpperCase()).list();
        return customers.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Contar total de clientes ativos
    public long countActiveCustomers() {
        return Customer.count("active = true");
    }

    // Métodos auxiliares para conversão DTO <-> Entity
    public CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.id = customer.id;
        dto.name = customer.name;
        dto.email = customer.email;
        dto.phone = customer.phone;
        dto.cpf = customer.cpf;
        dto.cep = customer.cep;
        dto.address = customer.address;
        dto.number = customer.number;
        dto.complement = customer.complement;
        dto.neighborhood = customer.neighborhood;
        dto.city = customer.city;
        dto.state = customer.state;
        dto.createdAt = customer.createdAt;
        dto.updatedAt = customer.updatedAt;
        dto.active = customer.active;
        dto.keycloakId = customer.keycloakId;
        dto.acceptsPromotionalEmails = customer.acceptsPromotionalEmails;

        return dto;
    }

    private Customer fromDTO(CustomerDTO dto) {
        Customer customer = new Customer();
        updateFromDTO(customer, dto);
        return customer;
    }

    private void updateFromDTO(Customer customer, CustomerDTO dto) {
        customer.name = dto.name;
        customer.email = dto.email;
        customer.phone = dto.phone;
        customer.cpf = dto.cpf;
        customer.cep = dto.cep;
        customer.address = dto.address;
        customer.number = dto.number;
        customer.complement = dto.complement;
        customer.neighborhood = dto.neighborhood;
        customer.city = dto.city;
        customer.state = dto.state != null ? dto.state.toUpperCase() : null;
        customer.acceptsPromotionalEmails = dto.acceptsPromotionalEmails != null ? dto.acceptsPromotionalEmails : false;
    }

    /**
     * Valida campos obrigatórios do Customer
     * @param customerDTO DTO a ser validado
     * @param requireFields Se true, valida campos obrigatórios; se false, permite null
     */
    private void validateRequiredFields(CustomerDTO customerDTO, boolean requireFields) {
        if (!requireFields) {
            return; // Permite campos null quando active = false
        }

        if (customerDTO.name == null || customerDTO.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (customerDTO.email == null || customerDTO.email.trim().isEmpty()) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }
        if (customerDTO.phone == null || customerDTO.phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Telefone é obrigatório");
        }
        if (customerDTO.cpf == null || customerDTO.cpf.trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
        if (customerDTO.cep == null || customerDTO.cep.trim().isEmpty()) {
            throw new IllegalArgumentException("CEP é obrigatório");
        }
        if (customerDTO.address == null || customerDTO.address.trim().isEmpty()) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }
        if (customerDTO.number == null || customerDTO.number.trim().isEmpty()) {
            throw new IllegalArgumentException("Número é obrigatório");
        }
        if (customerDTO.neighborhood == null || customerDTO.neighborhood.trim().isEmpty()) {
            throw new IllegalArgumentException("Bairro é obrigatório");
        }
        if (customerDTO.city == null || customerDTO.city.trim().isEmpty()) {
            throw new IllegalArgumentException("Cidade é obrigatória");
        }
        if (customerDTO.state == null || customerDTO.state.trim().isEmpty()) {
            throw new IllegalArgumentException("Estado é obrigatório");
        }
    }
}