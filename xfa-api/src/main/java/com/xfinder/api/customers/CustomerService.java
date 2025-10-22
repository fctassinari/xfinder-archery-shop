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
        // Limpar CPF e CEP (remover caracteres especiais)
        customerDTO.cpf = customerDTO.cpf.replaceAll("[^0-9]", "");
        customerDTO.cep = customerDTO.cep.replaceAll("[^0-9]", "");
        customerDTO.phone = customerDTO.phone.replaceAll("[^0-9]", "");

        // Verificar se já existe cliente com mesmo email
        Optional<Customer> existingEmail = Customer.find("email = ?1 AND active = true", customerDTO.email)
                .firstResultOptional();
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Já existe um cliente com este e-mail");
        }

        // Verificar se já existe cliente com mesmo CPF
        Optional<Customer> existingCpf = Customer.find("cpf = ?1 AND active = true", customerDTO.cpf)
                .firstResultOptional();
        if (existingCpf.isPresent()) {
            throw new IllegalArgumentException("Já existe um cliente com este CPF");
        }

        Customer customer = fromDTO(customerDTO);
        customer.persist();

        return toDTO(customer);
    }

    // Atualizar cliente
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = Customer.findById(id);
        if (customer == null || !customer.active) {
            throw new NotFoundException("Cliente não encontrado");
        }

        // Limpar CPF e CEP
        customerDTO.cpf = customerDTO.cpf.replaceAll("[^0-9]", "");
        customerDTO.cep = customerDTO.cep.replaceAll("[^0-9]", "");
        customerDTO.phone = customerDTO.phone.replaceAll("[^0-9]", "");

        // Verificar se o email já está sendo usado por outro cliente
        Optional<Customer> existingEmail = Customer.find("email = ?1 AND id != ?2 AND active = true",
                        customerDTO.email, id)
                .firstResultOptional();
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está sendo usado por outro cliente");
        }

        // Verificar se o CPF já está sendo usado por outro cliente
        Optional<Customer> existingCpf = Customer.find("cpf = ?1 AND id != ?2 AND active = true",
                        customerDTO.cpf, id)
                .firstResultOptional();
        if (existingCpf.isPresent()) {
            throw new IllegalArgumentException("Este CPF já está sendo usado por outro cliente");
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
    private CustomerDTO toDTO(Customer customer) {
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
        customer.state = dto.state.toUpperCase();
    }
}