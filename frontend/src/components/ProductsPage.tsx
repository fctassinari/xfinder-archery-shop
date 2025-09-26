import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Search, Filter, Grid3X3, List, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import archeryEquipment from "@/assets/archery-equipment.jpg";
import xpuller from "@/assets/x-puller.png";
import bowDetail from "@/assets/bow-detail.jpg";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import heroImage from "@/assets/heroWrap.jpg";

const ProductsPage = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const allProducts: (Product & {
    category: string;
    rating: number;
    reviews: number;
    features: string[];
    originalPrice?: number;
    isNew?: boolean;
    inStock: boolean;
  })[] = [
    {
      id: "1",
      name: "Puxadores de Flechas X-Pullerkkkkkkkkk",
      price: 70,
      image: xpuller,
      description: "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis.",
      category: "Acessórios",
      rating: 4.9,
      reviews: 127,
      features: ["Grip antideslizante", "Material durável", "Design ergonômico"],
      inStock: true
    },
    {
      id: "2", 
      name: "Kit Completo Iniciante Pro",
      price: 1299,
      originalPrice: 1599,
      image: archeryEquipment,
      description: "Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco.",
      category: "Kits",
      rating: 4.8,
      reviews: 89,
      features: ["Arco recurvo", "12 flechas", "Proteções incluídas", "Manual completo"],
      inStock: true
    },
    {
      id: "3",
      name: "Flechas de Carbono X-Precision",
      price: 349,
      image: archeryEquipment,
      description: "Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados.",
      category: "Flechas",
      rating: 4.9,
      reviews: 203,
      features: ["100% Carbono", "Peso consistente", "Ponta intercambiável"],
      inStock: true
    },
    {
      id: "4",
      name: "Arco Recurvo Elite Carbon Pro",
      price: 2899,
      originalPrice: 3299,
      image: bowDetail,
      description: "Arco recurvo profissional de competição com tecnologia avançada em carbono.",
      category: "Arcos",
      rating: 5.0,
      reviews: 45,
      features: ["World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System"],
      isNew: true,
      inStock: true
    },
    {
      id: "5",
      name: "Protetor de Braço Leather Pro",
      price: 89,
      image: archeryEquipment,
      description: "Protetor de braço em couro premium com ajuste perfeito e máximo conforto.",
      category: "Proteções",
      rating: 4.7,
      reviews: 156,
      features: ["Couro premium", "Ajuste perfeito", "Respirável"],
      inStock: false
    },
    {
      id: "6",
      name: "Alvo Profissional 122cm",
      price: 299,
      image: archeryEquipment,
      description: "Alvo oficial para competições com cores vivas e durabilidade excepcional.",
      category: "Alvos",
      rating: 4.6,
      reviews: 78,
      features: ["Padrão FITA", "Resistente às intempéries", "122cm diâmetro"],
      inStock: true
    }
  ];

  const categories = ["all", "Arcos", "Flechas", "Acessórios", "Kits", "Proteções", "Alvos"];

  const filteredProducts = allProducts.filter(product => {
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
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Loja de Produtos
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

          <div className="mt-4 text-sm text-muted-foreground">
            {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou busca.</p>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }>
              {sortedProducts.map((product, index) => (
                <Card 
                  key={product.id} 
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
                          <Star className="h-4 w-4 fill-coral-accent text-coral-accent" />
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
                        onClick={() => product.inStock && addItem(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.inStock ? "Comprar" : "Indisponível"}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => window.location.href = `/produto?id=${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;