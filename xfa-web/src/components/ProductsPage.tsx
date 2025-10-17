import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Search, Filter, Grid3X3, List, Eye, Ruler, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import heroImage from "@/assets/heroWrap.jpg";

// Interface para o produto da API
interface ApiProduct {
  id: string | number; // Agora aceita string OU number
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  originalPrice?: number;
  isNew?: boolean;
  inStock: boolean;
  // Novos campos da API Java
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  quantity?: number;
  variants?: ApiProduct[];
}

const ProductsPage = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Estados para carregamento dinâmico
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Extrair categorias únicas dos produtos
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category))).sort()];

  // Produtos hardcoded como fallback
  const hardcodedProducts: ApiProduct[] = [
    {
      id: "1",
      name: "Puxadores de Flechas X-Puller",
      price: 70,
      image: "x-puller.png",
      description: "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis.",
      category: "Acessórios",
      rating: 4.9,
      reviews: 127,
      features: ["Grip antideslizante", "Material durável", "Design ergonômico"],
      inStock: true,
      weight: 0.2,
      height: 15.0,
      width: 5.0,
      length: 10.0
    },
    {
      id: "2",
      name: "Kit Completo Iniciante Pro",
      price: 1299,
      originalPrice: 1599,
      image: "x-puller.png",
      description: "Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",
      category: "Kits",
      rating: 4.8,
      reviews: 89,
      features: ["Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"],
      inStock: true,
      weight: 2.5,
      height: 20.0,
      width: 30.0,
      length: 70.0
    },
    {
      id: "3",
      name: "Flechas de Carbono X-Precision",
      price: 349,
      image: "x-puller.png",
      description: "Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",
      category: "Flechas",
      rating: 4.9,
      reviews: 203,
      features: ["100% Carbono", "Peso consistente", "Ponta intercambiável"],
      inStock: true,
      weight: 0.8,
      height: 5.0,
      width: 5.0,
      length: 80.0
    },
    {
      id: "4",
      name: "Arco Recurvo Elite Carbon Pro",
      price: 2899,
      originalPrice: 3299,
      image: "bow-detail.jpg",
      description: "Arco recurvo profissional de competição com tecnologia avançada em carbono.",
      category: "Arcos",
      rating: 5.0,
      reviews: 45,
      features: ["World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"],
      isNew: true,
      inStock: true,
      weight: 1.5,
      height: 120.0,
      width: 25.0,
      length: 150.0
    },
    {
      id: "5",
      name: "Protetor de Braço Leather Pro",
      price: 89,
      image: "x-puller.png",
      description: "Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",
      category: "Proteções",
      rating: 4.7,
      reviews: 156,
      features: ["Couro premium", "Ajuste perfeito", "Respirável"],
      inStock: false,
      weight: 0.1,
      height: 25.0,
      width: 15.0,
      length: 1.0
    },
    {
      id: "6",
      name: "Alvo Profissional 122cm",
      price: 299,
      image: "x-puller.png",
      description: "Alvo oficial para competições com cores vivas e durabilidade excepcional.",
      category: "Alvos",
      rating: 4.6,
      reviews: 78,
      features: ["Padrão FITA", "Resistente às intempéries", "122cm diâmetro"],
      inStock: true,
      weight: 3.0,
      height: 122.0,
      width: 122.0,
      length: 15.0
    }
  ];

  // Função para buscar produtos da API
  const fetchProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    setApiError(false);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '6'
      });

      // Usando a variável de ambiente
      const baseUrl = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8081/api/products';
      const apiUrl = `${baseUrl}?${params}`;

      console.log('🔍 Buscando produtos da API...', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiProducts = await response.json();

      console.log('✅ Produtos recebidos da API:', apiProducts);

      if (!Array.isArray(apiProducts)) {
        throw new Error('Resposta da API não é um array');
      }

      // Converter produtos da API para o formato esperado
      const formattedProducts: ApiProduct[] = apiProducts.map((product: any) => ({
        id: String(product.id), // Converte para string
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        features: product.features || [],
        originalPrice: product.originalPrice,
        isNew: product.isNew,
        inStock: product.inStock !== undefined ? product.inStock : true,
        // Novos campos
        weight: product.weight,
        height: product.height,
        width: product.width,
        length: product.length,
        quantity: product.quantity,
        variants: product.variants ? product.variants.map((variant: any) => ({
          ...variant,
          id: String(variant.id) // Converte variantes também
        })) : undefined
      }));

      if (reset) {
        setProducts(formattedProducts);
      } else {
        setProducts(prev => [...prev, ...formattedProducts]);
      }

      setHasMore(formattedProducts.length === 6);

    } catch (error) {
      console.error('💥 Erro ao carregar produtos da API, usando fallback:', error);
      setApiError(true);

      // Usar produtos hardcoded como fallback
      const startIndex = reset ? 0 : products.length;
      const endIndex = startIndex + 6;
      const fallbackProducts = hardcodedProducts.slice(startIndex, endIndex);

      if (reset) {
        setProducts(fallbackProducts);
      } else {
        setProducts(prev => [...prev, ...fallbackProducts]);
      }

      setHasMore(endIndex < hardcodedProducts.length);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading, products.length]);

  // Carregar produtos iniciais
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, true);
  }, []);

  // Função para carregar mais produtos
  const loadMoreProducts = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  }, [loading, hasMore, page, fetchProducts]);

  // Observer para infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, loadMoreProducts]);

  // Aplicar filtros localmente
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "id":
        default:
          // Usa parseInt para garantir números inteiros
          const idA = parseInt(a.id, 10) || 0;
          const idB = parseInt(b.id, 10) || 0;
          return idA - idB;
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para formatar dimensões
  const formatDimensions = (product: ApiProduct) => {
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

  // Função para recarregar tentando a API novamente
  const retryApiLoad = () => {
    setPage(1);
    setProducts([]);
    setApiError(false);
    fetchProducts(1, true);
  };

  const handleAddToCart = (product: ApiProduct) => {
    if (product.variants && product.variants.length > 0) {
      // Se o produto tem variants, redirecionar para a página de detalhes
      navigate(`/produto?id=${String(product.id)}`); // Converte para string
    } else {
      // Se não tem variants, adicionar diretamente ao carrinho
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Produtos
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Equipamentos profissionais para arqueiros de todos os níveis
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas as Categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Código</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="price-low">Menor Preço</SelectItem>
                  <SelectItem value="price-high">Maior Preço</SelectItem>
                  <SelectItem value="rating">Avaliação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
              {apiError && " (modo offline)"}
            </div>

            {apiError && (
              <Button variant="outline" size="sm" onClick={retryApiLoad}>
                Tentar API Novamente
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 && !loading ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou busca.</p>
            </div>
          ) : (
            <>
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
              }>
                {sortedProducts.map((product, index) => (
                  <Card
                    key={`${product.id}-${index}`}
                    className={`group hover:shadow-elegant transition-smooth animate-fade-in ${
                      viewMode === "list" ? "flex flex-col md:flex-row overflow-hidden" : ""
                    }`}
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className={`relative ${viewMode === "list" ? "md:w-1/3" : ""}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-smooth ${
                            viewMode === "list" ? "w-full h-48 md:h-full" : "w-full h-48"
                          }`}
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isNew && (
                            <Badge className="bg-coral-accent text-white">
                              Novo
                            </Badge>
                          )}
                          {product.originalPrice && (
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
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews})</span>
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
                        {product.quantity !== undefined && (
                          <div className="mb-3 text-sm">
                            <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.quantity > 0 ? `${product.quantity} em estoque` : 'Fora de estoque'}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1 mb-4">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-coral-accent rounded-full mr-2 flex-shrink-0"></div>
                              {feature}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-navy-primary">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
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
                        <Button variant="outline" size="icon" onClick={() => navigate(`/produto?id=${String(product.id)}`)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Sentinel para infinite scroll */}
              <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                {loading && (
                  <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy-primary"></div>
                    <p className="mt-2 text-muted-foreground">Carregando mais produtos...</p>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      {apiError ?
                        "Todos os produtos disponíveis foram carregados (modo offline)" :
                        "Todos os produtos foram carregados."
                      }
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;