package com.xfinder.api.produtos;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    private final List<Product> products;

    public ProductService() {
        this.products = Arrays.asList(
                new Product("1", "X-Puller", 70.0, "x-puller.png","Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e edifiência.",0.06, 1.5, 8.0, 8.0, "Acessórios", 4.9, 127, null, false,new String[]{"Grip antideslizante", "Material durável", "Design ergonômico"},true),
                new Product("2", "Kit Completo Iniciante Pro", 1299.0, "archery-equipment.jpg","Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",2.5, 20.0, 30.0, 70.0, "Kits", 4.8, 89, 1599.0, false,new String[]{"Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"},true),
                new Product("3", "Flechas de Carbono X-Precision", 349.0, "archery-equipment.jpg","Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",0.8, 5.0, 5.0, 80.0, "Flechas", 4.9, 203, null, false,new String[]{"100% Carbono", "Peso consistente", "Ponta intercambiável"},true),
                new Product("4", "Arco Recurvo Elite Carbon Pro", 2899.0, "bow-detail.jpg","Arco recurvo profissional de competição com tecnologia avançada em carbono.",1.5, 120.0, 25.0, 150.0, "Arcos", 5.0, 45, 3299.0, true,new String[]{"World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"},true),
                new Product("5", "Protetor de Braço Leather Pro", 89.0, "archery-equipment.jpg","Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",0.1, 25.0, 15.0, 1.0, "Proteções", 4.7, 156, null, false,new String[]{"Couro premium", "Ajuste perfeito", "Respirável"},true),
                new Product("6", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("7", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("8", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("9", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("10", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("11", "Puxadores de Flechas X-Puller", 70.0, "x-puller.png","Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis.",0.2, 15.0, 5.0, 10.0, "Acessórios", 4.9, 127, null, false,new String[]{"Grip antideslizante", "Material durável", "Design ergonômico"},true),
                new Product("12", "Kit Completo Iniciante Pro", 1299.0, "archery-equipment.jpg","Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",2.5, 20.0, 30.0, 70.0, "Kits", 4.8, 89, 1599.0, false,new String[]{"Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"},true),
                new Product("13", "Flechas de Carbono X-Precision", 349.0, "archery-equipment.jpg","Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",0.8, 5.0, 5.0, 80.0, "Flechas", 4.9, 203, null, false,new String[]{"100% Carbono", "Peso consistente", "Ponta intercambiável"},true),
                new Product("14", "Arco Recurvo Elite Carbon Pro", 2899.0, "bow-detail.jpg","Arco recurvo profissional de competição com tecnologia avançada em carbono.",1.5, 120.0, 25.0, 150.0, "Arcos", 5.0, 45, 3299.0, true,new String[]{"World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"},true),
                new Product("15", "Protetor de Braço Leather Pro", 89.0, "archery-equipment.jpg","Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",0.1, 25.0, 15.0, 1.0, "Proteções", 4.7, 156, null, false,new String[]{"Couro premium", "Ajuste perfeito", "Respirável"},true),
                new Product("16", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("17", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("18", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("19", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("20", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("21", "Puxadores de Flechas X-Puller", 70.0, "x-puller.png","Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis.",0.2, 15.0, 5.0, 10.0, "Acessórios", 4.9, 127, null, false,new String[]{"Grip antideslizante", "Material durável", "Design ergonômico"},true),
                new Product("22", "Kit Completo Iniciante Pro", 1299.0, "archery-equipment.jpg","Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",2.5, 20.0, 30.0, 70.0, "Kits", 4.8, 89, 1599.0, false,new String[]{"Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"},true),
                new Product("23", "Flechas de Carbono X-Precision", 349.0, "archery-equipment.jpg","Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",0.8, 5.0, 5.0, 80.0, "Flechas", 4.9, 203, null, false,new String[]{"100% Carbono", "Peso consistente", "Ponta intercambiável"},true),
                new Product("24", "Arco Recurvo Elite Carbon Pro", 2899.0, "bow-detail.jpg","Arco recurvo profissional de competição com tecnologia avançada em carbono.",1.5, 120.0, 25.0, 150.0, "Arcos", 5.0, 45, 3299.0, true,new String[]{"World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"},true),
                new Product("25", "Protetor de Braço Leather Pro", 89.0, "archery-equipment.jpg","Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",0.1, 25.0, 15.0, 1.0, "Proteções", 4.7, 156, null, false,new String[]{"Couro premium", "Ajuste perfeito", "Respirável"},true),
                new Product("26", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("27", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("28", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("29", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("30", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("31", "Puxadores de Flechas X-Puller", 70.0, "x-puller.png","Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis.",0.2, 15.0, 5.0, 10.0, "Acessórios", 4.9, 127, null, false,new String[]{"Grip antideslizante", "Material durável", "Design ergonômico"},true),
                new Product("32", "Kit Completo Iniciante Pro", 1299.0, "archery-equipment.jpg","Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",2.5, 20.0, 30.0, 70.0, "Kits", 4.8, 89, 1599.0, false,new String[]{"Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"},true),
                new Product("33", "Flechas de Carbono X-Precision", 349.0, "archery-equipment.jpg","Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",0.8, 5.0, 5.0, 80.0, "Flechas", 4.9, 203, null, false,new String[]{"100% Carbono", "Peso consistente", "Ponta intercambiável"},true),
                new Product("34", "Arco Recurvo Elite Carbon Pro", 2899.0, "bow-detail.jpg","Arco recurvo profissional de competição com tecnologia avançada em carbono.",1.5, 120.0, 25.0, 150.0, "Arcos", 5.0, 45, 3299.0, true,new String[]{"World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"},true),
                new Product("35", "Protetor de Braço Leather Pro", 89.0, "archery-equipment.jpg","Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",0.1, 25.0, 15.0, 1.0, "Proteções", 4.7, 156, null, false,new String[]{"Couro premium", "Ajuste perfeito", "Respirável"},true),
                new Product("36", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("37", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("38", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("39", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"},true),
                new Product("40", "Alvo Profissional 122cm", 299.0, "archery-equipment.jpg","Alvo oficial para competições com cores vivas e durabilidade excepcional.",3.0, 122.0, 122.0, 15.0, "Alvos", 4.6, 78, null, false,new String[]{"Padrão FITA", "Resistente às intempéries", "122cm diâmetro"})
        );
    }

    public List<Product> getAllProducts() {
        return products;
    }

    public Optional<Product> getProductById(String id) {
        return products.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst();
    }

    public List<Product> getProductsByCategory(String category) {
        return products.stream()
                .filter(product -> product.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<Product> getFeaturedProducts() {
        return products.stream()
                .filter(product -> product.getIsNew() != null && product.getIsNew())
                .collect(Collectors.toList());
    }

    public List<Product> getProductsPaginated(int page, int limit) {
        if (page < 1) page = 1;
        if (limit < 1) limit = 6;

        int skip = (page - 1) * limit;

        return products.stream()
                .skip(skip)
                .limit(limit)
                .collect(Collectors.toList());
    }
}