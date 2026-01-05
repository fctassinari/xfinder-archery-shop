package com.xfinder.api.produtos;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    // Listar produtos com paginação - EXCLUINDO produtos que são variantes
    public List<ProductDTO> getProductsPaginated(int page, int limit) {
        int offset = (page - 1) * limit;

        // CORREÇÃO: Usando LEFT JOIN para excluir produtos que são variantes
        List<Product> products = Product.find(
                        "SELECT p FROM Product p LEFT JOIN ProductVariant pv ON p.id = pv.variantProduct.id " +
                                "WHERE pv.variantProduct.id IS NULL ORDER BY p.id"
                )
                .range(offset, offset + limit - 1)
                .list();

        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Método opcional: buscar produtos COM variantes
    public List<ProductDTO> getProductsWithVariantsPaginated(int page, int limit) {
        int offset = (page - 1) * limit;

        List<Product> products = Product.find("variants IS NOT EMPTY ORDER BY id")
                .range(offset, offset + limit - 1)
                .list();

        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }






    // Buscar produto por ID
    public Optional<ProductDTO> getProductById(Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            return Optional.empty();
        }
        return Optional.of(toDTO(product));
    }

    // Buscar produtos por categoria
    public List<ProductDTO> getProductsByCategory(String category) {
        List<Product> products = Product.find("category", category).list();
        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Produtos em destaque (produtos com maior rating e em stock)
    public List<ProductDTO> getFeaturedProducts() {
        List<Product> products = Product.find("rating >= ?1 AND inStock = ?2 ORDER BY rating DESC", 4.5, true)
                .range(0, 5) // Limita a 5 produtos em destaque
                .list();

        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Produtos em oferta (produtos com originalPrice maior que price atual)
    public List<ProductDTO> getProductsOnSale() {
        // Buscar produtos que são produtos principais (não variantes) e que estão em oferta
        List<Product> products = Product.find(
                        "SELECT p FROM Product p LEFT JOIN ProductVariant pv ON p.id = pv.variantProduct.id " +
                                "WHERE pv.variantProduct.id IS NULL " +
                                "AND p.originalPrice IS NOT NULL " +
                                "AND p.originalPrice > p.price " +
                                "AND p.inStock = true " +
                                "ORDER BY (p.originalPrice - p.price) DESC"
                )
                .list();

        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

//    public List<com.xfinder.api.produtosold.Product> getFeaturedProducts() {
//        return products.stream()
//                .filter(product -> product.getIsNew() != null && product.getIsNew())
//                .collect(Collectors.toList());
//    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        // 1. Criar o produto principal
        Product product = fromDTO(productDTO);
        product.persist();

        // 2. Salvar features do produto principal
        if (productDTO.features != null) {
            for (String feature : productDTO.features) {
                ProductFeature productFeature = new ProductFeature(product, feature);
                productFeature.persist();
            }
        }

        // CORREÇÃO: 3. Criar produtos variantes e relacionamentos
        if (productDTO.variants != null && !productDTO.variants.isEmpty()) {
            for (ProductVariantDTO variantDTO : productDTO.variants) {
                // Criar o produto variante
                Product variantProduct = createVariantProduct(variantDTO);
                variantProduct.persist();

                // Salvar features da variante
                if (variantDTO.features != null) {
                    for (String feature : variantDTO.features) {
                        ProductFeature variantFeature = new ProductFeature(variantProduct, feature);
                        variantFeature.persist();
                    }
                }

                // Criar o relacionamento na tabela product_variants
                ProductVariant productVariant = new ProductVariant(product, variantProduct);
                productVariant.persist();
            }
        }

        return toDTO(product);
    }

    // Método auxiliar para criar produto variante
    private Product createVariantProduct(ProductVariantDTO variantDTO) {
        Product variantProduct = new Product();
        variantProduct.name = variantDTO.name;
        variantProduct.price = variantDTO.price;
        variantProduct.image = variantDTO.image;
        variantProduct.description = variantDTO.description;
        variantProduct.weight = variantDTO.weight;
        variantProduct.height = variantDTO.height;
        variantProduct.width = variantDTO.width;
        variantProduct.length = variantDTO.length;
        variantProduct.category = variantDTO.category;
        variantProduct.rating = variantDTO.rating;
        variantProduct.reviews = variantDTO.reviews;
        variantProduct.originalPrice = variantDTO.originalPrice;
        variantProduct.isNew = variantDTO.isNew;
        variantProduct.inStock = variantDTO.inStock;
        variantProduct.quantity = variantDTO.quantity;

        return variantProduct;
    }

    // Atualizar produto
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Produto não encontrado");
        }

        updateFromDTO(product, productDTO);

        // Atualizar features do produto principal
        if (productDTO.features != null) {
            // Remover features antigas
            ProductFeature.delete("product", product);

            // Adicionar novas features
            for (String feature : productDTO.features) {
                ProductFeature productFeature = new ProductFeature(product, feature);
                productFeature.persist();
            }
        }

        // CORREÇÃO: Atualizar variantes
        if (productDTO.variants != null) {
            // Remover variantes antigas e seus produtos
            List<ProductVariant> existingVariants = ProductVariant.find("parentProduct", product).list();
            for (ProductVariant existingVariant : existingVariants) {
                // Opcional: deletar também o produto variante
                // existingVariant.variantProduct.delete();
                existingVariant.delete();
            }

            // Criar novas variantes
            for (ProductVariantDTO variantDTO : productDTO.variants) {
                // Criar ou atualizar o produto variante
                Product variantProduct = createVariantProduct(variantDTO);
                variantProduct.persist();

                // Salvar features da variante
                if (variantDTO.features != null) {
                    for (String feature : variantDTO.features) {
                        ProductFeature variantFeature = new ProductFeature(variantProduct, feature);
                        variantFeature.persist();
                    }
                }

                // Criar o relacionamento
                ProductVariant productVariant = new ProductVariant(product, variantProduct);
                productVariant.persist();
            }
        }

        return toDTO(product);
    }

    // Deletar produto
    @Transactional
    public void deleteProduct(Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Produto não encontrado");
        }

        product.delete();
    }

    // Métodos auxiliares para conversão DTO <-> Entity
    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.id = product.id;
        dto.name = product.name;
        dto.price = product.price;
        dto.image = product.image;
        dto.description = product.description;
        dto.weight = product.weight;
        dto.height = product.height;
        dto.width = product.width;
        dto.length = product.length;
        dto.category = product.category;
        dto.rating = product.rating;
        dto.reviews = product.reviews;
        dto.originalPrice = product.originalPrice;
        dto.isNew = product.isNew;
        dto.inStock = product.inStock;
        dto.quantity = product.quantity;

        // Features
        dto.features = product.features.stream()
                .map(pf -> pf.feature)
                .collect(Collectors.toList());

        // CORREÇÃO: Variantes com todos os dados completos
        dto.variants = product.variants.stream()
                .map(pv -> {
                    Product variantProduct = pv.variantProduct;
                    ProductVariantDTO variantDTO = new ProductVariantDTO();
                    variantDTO.id = variantProduct.id;
                    variantDTO.name = variantProduct.name;
                    variantDTO.price = variantProduct.price;
                    variantDTO.image = variantProduct.image;
                    variantDTO.description = variantProduct.description;
                    variantDTO.weight = variantProduct.weight;
                    variantDTO.height = variantProduct.height;
                    variantDTO.width = variantProduct.width;
                    variantDTO.length = variantProduct.length;
                    variantDTO.category = variantProduct.category;
                    variantDTO.rating = variantProduct.rating;
                    variantDTO.reviews = variantProduct.reviews;
                    variantDTO.originalPrice = variantProduct.originalPrice;
                    variantDTO.isNew = variantProduct.isNew;
                    variantDTO.inStock = variantProduct.inStock;
                    variantDTO.quantity = variantProduct.quantity;

                    // Features da variante
                    variantDTO.features = variantProduct.features.stream()
                            .map(pf -> pf.feature)
                            .collect(Collectors.toList());

                    return variantDTO;
                })
                .collect(Collectors.toList());

        return dto;
    }

    private Product fromDTO(ProductDTO dto) {
        Product product = new Product();
        updateFromDTO(product, dto);
        return product;
    }

    private void updateFromDTO(Product product, ProductDTO dto) {
        product.name = dto.name;
        product.price = dto.price;
        product.image = dto.image;
        product.description = dto.description;
        product.weight = dto.weight;
        product.height = dto.height;
        product.width = dto.width;
        product.length = dto.length;
        product.category = dto.category;
        product.rating = dto.rating;
        product.reviews = dto.reviews;
        product.originalPrice = dto.originalPrice;
        product.isNew = dto.isNew;
        product.inStock = dto.inStock;
        product.quantity = dto.quantity;
        // Nota: As variantes são tratadas separadamente no updateProduct
    }
}