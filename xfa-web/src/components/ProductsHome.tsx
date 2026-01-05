import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye, Ruler, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import { productService, ProductDetails } from "@/services/productService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Interface para o produto estendido com variants
interface ExtendedProduct extends Product {
  variants?: any[];
  inStock?: boolean;
}

const Products = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const apiProducts = await productService.getProductsOnSale();

        // Converter produtos da API para o formato do frontend com campos extras
        const convertedProducts: ExtendedProduct[] = apiProducts.map(apiProduct => ({
          ...productService.convertToProduct(apiProduct),
          variants: apiProduct.variants,
          inStock: apiProduct.quantity !== undefined ? apiProduct.quantity > 0 : true
        }));

        // Extrair detalhes adicionais
        const details = apiProducts.map(apiProduct =>
          productService.extractProductDetails(apiProduct)
        );

        // Pegar apenas os 3 primeiros produtos e detalhes
        setProducts(convertedProducts.slice(0, 3));
        setProductDetails(details.slice(0, 3));
      } catch (err) {
        setError('Erro ao carregar produtos. Usando dados locais.');
        console.error('Erro ao buscar produtos:', err);

        // Dados fallback
        const fallbackProducts: ExtendedProduct[] = [
          {
            id: "1",
            name: "Arco Recurvo Profissional X-Elite",
            price: 70,
            image: "x-puller.png",
            description: "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle.",
            weight: 0.2,
            height: 15,
            width: 5,
            length: 10,
            quantity: 15,
            inStock: true
          },
          {
            id: "2",
            name: "Kit Completo Iniciante Pro",
            price: 1299,
            image: "archery-equipment.jpg",
            description: "Kit completo para iniciantes com todos os acessórios necessários.",
            weight: 2.5,
            height: 20,
            width: 30,
            length: 70,
            quantity: 8,
            inStock: true
          },
          {
            id: "3",
            name: "Flechas de Carbono X-Precision",
            price: 349,
            image: "archery-equipment.jpg",
            description: "Flechas de carbono de altíssima qualidade para competições.",
            weight: 0.8,
            height: 5,
            width: 5,
            length: 80,
            quantity: 25,
            inStock: true
          },
          {
            id: "4",
            name: "Produto Extra Não Listado",
            price: 499,
            image: "produto-extra.jpg",
            description: "Descrição extra.",
            weight: 1,
            height: 10,
            width: 10,
            length: 10,
            quantity: 0,
            inStock: false
          }
        ];

        const fallbackDetails: ProductDetails[] = [
          {
            originalPrice: 2899,
            rating: 5,
            reviews: 23,
            category: "Arcos",
            features: ["World Archery Approved", "Carbono Premium", "Peso ajustável"],
            isNew: true
          },
          {
            originalPrice: 1599,
            rating: 4.8,
            reviews: 45,
            category: "Kits",
            features: ["Arco + Flechas", "Proteções", "Alvo profissional"],
            isNew: false
          },
          {
            rating: 4.9,
            reviews: 67,
            category: "Flechas",
            features: ["100% Carbono", "Peso consistente", "Ponta intercambiável"],
            isNew: false
          },
          {
            originalPrice: 799,
            rating: 4.5,
            reviews: 10,
            category: "Acessórios",
            features: ["Alta durabilidade", "Design moderno"],
            isNew: true
          }
        ];

        // Pegar apenas os 3 primeiros no fallback também
        setProducts(fallbackProducts.slice(0, 3));
        setProductDetails(fallbackDetails.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para formatar dimensões
  const formatDimensions = (product: Product) => {
    if (product.height && product.width && product.length) {
      return `${product.height} × ${product.width} × ${product.length} cm`;
    }
    return null;
  };

  // Função para formatar peso
  const formatWeight = (weight?: number) => {
    if (weight) {
      return `${weight} kg`;
    }
    return null;
  };

  // Função para adicionar ao carrinho com validação de variants
  const handleAddToCart = (product: ExtendedProduct) => {
    if (product.variants && product.variants.length > 0) {
      // Se o produto tem variants, redirecionar para a página de detalhes
      navigate(`/produto?id=${product.id}`);
    } else {
      // Se não tem variants, adicionar diretamente ao carrinho
      addItem(product);
    }
  };

  // Função para alternar favorito
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-xl">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-primary mb-4">
            Nossos Produtos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Equipamentos de tiro com arco da mais alta qualidade 
            para competições profissionais, treinos de elite e lazer.
          </p>
          {error && (
            <p className="text-sm text-orange-600 mt-2">
              ⚠️ {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const details = productDetails[index];
            return (
              <Card key={product.id} className="group hover:shadow-elegant transition-smooth animate-fade-in flex flex-col h-full" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {details?.isNew && (
                        <Badge className="bg-coral-accent text-white">
                          Novo
                        </Badge>
                      )}
                      {details?.originalPrice && (
                        <Badge variant="destructive">
                          Oferta
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge variant="secondary">
                          Fora de Estoque
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{details?.category || "Produto"}</Badge>
                    <div className="flex items-center space-x-1 hidden">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{details?.rating || 5.0}</span>
                      <span className="text-sm text-muted-foreground">({details?.reviews || 0})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-navy-primary transition-smooth">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 flex-1 flex flex-col">
                  <CardDescription className="mb-3">
                    {product.description}
                  </CardDescription>

                  {/* Dimensões e Peso */}
                  {(product.weight || product.height) && (
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      {product.weight && (
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          <span>{formatWeight(product.weight)}</span>
                        </div>
                      )}
                      {formatDimensions(product) && (
                        <div className="flex items-center">
                          <Ruler className="h-3 w-3 mr-1" />
                          <span>{formatDimensions(product)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantidade em Estoque */}
                  {product.quantity !== undefined && (
                    <div className="mb-3 text-sm">
                      <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.quantity > 0 ? `${product.quantity} em estoque` : 'Fora de estoque'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 mb-4 flex-1">
                    {details?.features?.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-coral-accent rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 mt-auto">
                    <span className="text-2xl font-bold text-navy-primary">{formatPrice(product.price)}</span>
                    {details?.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(details.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 space-x-2">
                  <Button 
                    variant={product.inStock ? "archery" : "outline"}
                    className="flex-1"
                    onClick={() => product.inStock && handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigate(`/produto?id=${product.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="archery" size="xl" asChild className="group">
            <a href="/produtos">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;