import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import { productService, ApiProduct, ProductDetails } from "@/services/productService";
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
        
        setProducts(convertedProducts);
        setProductDetails(details);
      } catch (err) {
        setError('Erro ao carregar produtos. Usando dados locais.');
        console.error('Erro ao buscar produtos:', err);

        // Fallback para dados hardcoded em caso de erro
        const fallbackProducts: Product[] = [
          {
            id: "1",
            name: "Arco Recurvo Profissional X-Elite",
            price: 70,
            image: "/src/assets/x-puller.png",
            description: "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle.",
            weight: 0.2,
            height: 15,
            width: 5,
            length: 10
          },
          {
            id: "2", 
            name: "Kit Completo Iniciante Pro",
            price: 1299,
            image: "/src/assets/archery-equipment.jpg",
            description: "Kit completo para iniciantes com todos os acessórios necessários.",
            weight: 2.5,
            height: 20,
            width: 30,
            length: 70
          },
          {
            id: "3",
            name: "Flechas de Carbono X-Precision",
            price: 349,
            image: "/src/assets/archery-equipment.jpg",
            description: "Flechas de carbono de altíssima qualidade para competições.",
            weight: 0.8,
            height: 5,
            width: 5,
            length: 80
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
          }
        ];

        setProducts(fallbackProducts);
        setProductDetails(fallbackDetails);
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
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-smooth"
                    />
                    {details?.isNew && (
                      <Badge className="absolute top-4 left-4 bg-coral-accent text-white">
                        Novo
                      </Badge>
                    )}
                    {details?.originalPrice && (
                      <Badge variant="destructive" className="absolute top-4 right-4">
                        Oferta
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{details?.category || "Produto"}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-coral-accent text-coral-accent" />
                      <span className="text-sm font-medium">{details?.rating || 5.0}</span>
                      <span className="text-sm text-muted-foreground">({details?.reviews || 0})</span>
                    </div>
                  </div>

                  <CardTitle className="text-xl mb-2 group-hover:text-navy-primary transition-smooth">
                    {product.name}
                  </CardTitle>
                  
                  <CardDescription className="mb-4">
                    {product.description}
                  </CardDescription>

                  <div className="space-y-2 mb-4">
                    {details?.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-coral-accent rounded-full mr-2"></div>
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

                <CardFooter className="p-6 pt-0 space-x-2">
                  <Button 
                    variant="archery" 
                    className="flex-1"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
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