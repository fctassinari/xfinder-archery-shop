package com.xfinder.api.produtos;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    private final List<Product> products;
    List<Product> tapVariants = Arrays.asList(
            new Product("15a","X-Tap - Cavalete"     ,   2.0, "x-tap-cavalete.jpg","Adesivos temáticos",0.01, 3.0, 3.0, 13.0, "Adesivos",              4.8,  89, null, false,new String[]{"Lindos", "Variados"},true,2,null),
            new Product("15b","X-Tap - Arqueira"     ,   2.0, "x-tap-arqueira.jpg","Adesivos temáticos",0.01, 3.0, 3.0, 13.0, "Adesivos",              4.8,  89, null, false,new String[]{"Lindos", "Variados"},true,4,null),
            new Product("15c","X-Tap - Arco"         ,   2.0, "x-tap-arco.jpg","Adesivos temáticos"    ,0.01, 3.0, 3.0, 13.0, "Adesivos",              4.8,  89, null, false,new String[]{"Lindos", "Variados"},true,5,null),
            new Product("15d","X-Tap - Alvo"         ,   2.0, "x-tap-alvo.jpg","Adesivos temáticos"    ,0.01, 3.0, 3.0, 13.0, "Adesivos",              4.8,  89, null, false,new String[]{"Lindos", "Variados"},true,5,null)
    );

    public ProductService() {
        this.products = Arrays.asList(
                new Product("1", "X-Puller"             ,  70.0, "x-puller.png","Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e edifiência.",0.06, 1.5, 8.0, 8.0,  "Acess. Flechas",        4.9, 127, null, false,new String[]{"Grip antideslizante", "Material durável", "Design ergonômico"},true,30,null),
                new Product("2", "X-Lube"               ,  70.0, "x-lube.jpg","Silicone para diminuir o esfroço de extrair a flecha do fardo."                                  ,0.07, 3.0, 3.0, 13.0, "Acess. Flechas",        4.8,  89, null, false,new String[]{"Alta Viscosidade", "Fácil Utilização", "Rende mais tiros entre utilização"},true,20,null),
                new Product("3", "X-Nock Adapter - 3 mm",  80.0, "x-na-protour.jpg","Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha"                 ,0.01, 3.0, 3.0, 13.0, "Acess. Flechas",        4.8,  89, null, false,new String[]{"Feito em Alumínio", "Adequado para felchas Protour / X10", "Ou em tubos com 3 mm de diâmetro interno", "12 unidades"},true,10,null),
                new Product("4", "X-Nock Adapter - 5 mm",  80.0, "x-na-ace.jpg","Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha"                     ,0.01, 3.0, 3.0, 13.0, "Acess. Flechas",        4.8,  89, null, false,new String[]{"Feito em Alumínio", "Adequado para felchas ACE", "Ou em tubos com 5 mm de diâmetro interno", "12 unidades"},true,10,null),
                new Product("5", "X-Nock Adapter - 7 mm",  80.0, "x-na-x7.jpg","Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha"                      ,0.01, 3.0, 3.0, 13.0, "Acess. Flechas",        4.8,  89, null, false,new String[]{"Feito em Alumínio", "Adequado para felchas X7 2314", "Ou em tubos com 5 mm de diâmetro interno", "12 unidades"},true,10,null),
                new Product("6", "X-Nock Adapter - 8 mm",  80.0, "x-na-x23.jpg","Adaptador de Nock para um perfeito encaixe dos nocks com o tubo de flecha"                     ,0.01, 3.0, 3.0, 13.0, "Acess. Flechas",        4.8,  89, null, false,new String[]{"Feito em Alumínio", "Adequado para felchas X23 2314 / 2315", "Ou em tubos com 5 mm de diâmetro interno", "12 unidades"},true,10,null),
                new Product("7", "Chave Allen"          ,  80.0, "x-allen.jpg","Jogo de chaves Allen canivete com 7 medidas em milímetros e 7 medidas em polegadas"             ,0.01, 3.0, 3.0, 13.0, "Ferramentas",           4.8,  89, null, false,new String[]{"1 mm", "2 mm", "3 mm", "4 mm", "5 mm", "6 mm", "7 mm", "1 pol", "2 pol", "3 pol", "4 pol", "5 pol", "6 pol", "7 pol"},true,10,null),
                new Product("8", "X-Dumper Sight"       , 120.0, "x-dumper-sight.jpg","Dumper para eliminar a vibração na haste da mira"                                        ,0.01, 3.0, 3.0, 13.0, "Acess. Mira",           4.8,  89, null, false,new String[]{"Corpo de Borracha", "Peso em aço inox", "Vendido em pares"},true,3,null),
                new Product("9", "X-VBar"               , 130.0, "x-vbar.jpg","VBar em alumínio para estabilizadores"                                                           ,0.01, 3.0, 3.0, 13.0, "Acess. Estabilização",  4.8,  89, null, false,new String[]{"Em Alumínio", "Leve", "Resistente"},true,2,null),
                new Product("10","X-Pin Branco"         ,   5.0, "x-pin-branco.jpg","Grampo para fixação de alvo"                                                               ,0.01, 3.0, 3.0, 13.0, "Acess. Alvo",           4.8,  89, null, false,new String[]{"Resistente", "Não destroi a flecha"},true,16,null),
                new Product("11","X-Pin Amarelo"        ,   5.0, "x-pin-amarelo.jpg","Grampo para fixação de alvo"                                                              ,0.01, 3.0, 3.0, 13.0, "Acess. Alvo",           4.8,  89, null, false,new String[]{"Resistente", "Não destroi a flecha"},true,22,null),
                new Product("12","X-Pin Cinza"          ,   5.0, "x-pin-cinza.jpg","Grampo para fixação de alvo"                                                                ,0.01, 3.0, 3.0, 13.0, "Acess. Alvo",           4.8,  89, null, false,new String[]{"Resistente", "Não destroi a flecha"},true,115,null),
                new Product("13","X-Pin Azul"           ,   5.0, "x-pin-azul.jpg","Grampo para fixação de alvo"                                                                 ,0.01, 3.0, 3.0, 13.0, "Acess. Alvo",           4.8,  89, null, false,new String[]{"Resistente", "Não destroi a flecha"},true,78,null),
                new Product("14","X-Pin Hard Core"      ,   8.0, "x-pin-hc.jpg","Grampo para fixação de alvo"                                                                   ,0.01, 3.0, 3.0, 13.0, "Acess. Alvo",           4.8,  89, null, false,new String[]{"Resistente", "Não destroi a flecha"},true,78,null),
                new Product("15","X-Tap"                ,   2.0, "x-tap.jpg","Adesivos temáticos"                                                                               ,0.01, 3.0, 3.0, 13.0, "Adesivos",              4.8,  89, null, false,new String[]{"Lindos", "Variados","Colecionáveis"},true,16,tapVariants)
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