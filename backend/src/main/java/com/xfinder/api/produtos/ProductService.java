package com.xfinder.api.produtos;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductService {

    private final List<Product> products;

    public ProductService() {
        // Mock de dados dos produtos
        this.products = Arrays.asList(
            new Product(
                "1", //id
                "Arco Recurvo Profissional X-Elite", //name
                70.0, //price
                "x-puller.png", //image
                "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis, os puxadores garantem um manuseio firme e seguro das flechas, facilitando a extração e contribuindo para evitar lesões e danos as flechas.", //description
                0.2, //weight
                15.0, //height
                5.0, //width
                10.0, //length
                "Arcos", //category
                5.0, // rating
                23, // reviews
                2899.0, // originalPrice
                true, // isNew
                new String[]{"World Archery Approved", "Carbono Premium", "Peso ajustável"} //features
            ),
            new Product(
                "2",
                "Kit Completo Iniciante Pro",
                1299.0,
                "archery-equipment.jpg",
                "Kit completo para iniciantes com todos os acessórios necessários.",
                2.5,
                20.0,
                30.0,
                70.0,
                "Kits",
                4.8,
                45,
                1599.0,
                false,
                new String[]{"Arco + Flechas", "Proteções", "Alvo profissional"}
            ),
            new Product(
                "3",
                "Flechas de Carbono X-Precision",
                349.0,
                "archery-equipment.jpg",
                "Flechas de carbono de altíssima qualidade para competições.",
                0.8,
                5.0,
                5.0,
                80.0,
                "Flechas",
                4.9,
                67,
                null,
                false,
                new String[]{"100% Carbono", "Peso consistente", "Ponta intercambiável"}
            ),
            new Product(
                "4",
                "Mira Profissional X-Sight",
                450.0,
                "archery-equipment.jpg",
                "Mira de precisão para competições profissionais com ajuste micrométrico.",
                0.3,
                12.0,
                8.0,
                15.0,
                "Acessórios",
                4.7,
                32,
                550.0,
                true,
                new String[]{"Ajuste micrométrico", "Fibra óptica", "Resistente à água"}
            ),
            new Product(
                "5",
                "Estabilizador Carbon Pro",
                280.0,
                "archery-equipment.jpg",
                "Estabilizador de carbono para melhor equilíbrio e precisão do tiro.",
                0.15,
                30.0,
                2.0,
                2.0,
                "Acessórios",
                4.6,
                28,
                null,
                false,
                new String[]{"100% Carbono", "Peso ajustável", "Rosca padrão"}
            ),
            new Product(
                "6",
                "Protetor de Braço Elite",
                85.0,
                "archery-equipment.jpg",
                "Protetor de braço em couro sintético de alta qualidade.",
                0.1,
                25.0,
                15.0,
                1.0,
                "Proteções",
                4.4,
                156,
                null,
                false,
                new String[]{"Couro sintético", "Ajuste universal", "Respirável"}
            )
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
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Product> getFeaturedProducts() {
        return products.stream()
                .filter(product -> product.getIsNew() != null && product.getIsNew())
                .collect(java.util.stream.Collectors.toList());
    }
}

