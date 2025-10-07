import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye, Ruler, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import { productService, ProductDetails } from "@/services/productService";
import { useState, useEffect } from "react";

const Products = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const apiProducts = await productService.getAllProducts();

        // Converter produtos da API para o formato do frontend
        const convertedProducts = apiProducts.map(apiProduct =>
          productService.convertToProduct(apiProduct)
        );

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
        const fallbackProducts: Product[] = [
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
            qtd: 15
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
            qtd: 8
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
            qtd: 25
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
            qtd: 0
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
              <Card key={product.id} className="group hover:shadow-elegant transition-smooth animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
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
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{details?.category || "Produto"}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-coral-accent text-coral-accent" />
                      <span className="text-sm font-medium">{details?.rating || 5.0}</span>
                      <span className="text-sm text-muted-foreground">({details?.reviews || 0})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-navy-primary transition-smooth">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
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
                  {product.qtd !== undefined && (
                    <div className="mb-3 text-sm">
                      <span className={`font-medium ${product.qtd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.qtd > 0 ? `${product.qtd} em estoque` : 'Fora de estoque'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 mb-4">
                    {details?.features?.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-coral-accent rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
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
                    variant="archery" 
                    className="flex-1"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => window.location.href = `/produto?id=${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="xl" asChild>
            <a href="/produtos">
              Ver Todos os Produtos
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;