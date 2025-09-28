import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";

const ProdutoDetalhesPage = () => {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const [selectedVariant, setSelectedVariant] = useState(0);
  
  const productId = searchParams.get('id') || '1';
  
  const allProducts: (Product & {
    category: string;
    rating: number;
    reviews: number;
    features: string[];
    originalPrice?: number;
    isNew?: boolean;
    inStock: boolean;
    variants?: Array<{
      id: string;
      name: string;
      image: string;
      price: number;
      description: string;
    }>;
  })[] = [
    {
      id: "1",
      name: "Puxadores de Flechas X-Elite",
      price: 70,
      image: x-puller.png,
      description: "Puxadores de Flechas de alta qualidade, projetados para oferecer máximo conforto e controle. Essenciais para arqueiros de todos os níveis. Fabricados com materiais premium e design ergonômico para garantir durabilidade e performance.",
      category: "Acessórios",
      rating: 4.9,
      reviews: 127,
      features: ["Grip antideslizante", "Material durável", "Design ergonômico", "Compatível com todas as flechas", "Garantia de 2 anos"],
      inStock: true,
      variants: [
        {
          id: "1a",
          name: "X-Elite Preto",
          image: x-puller.png,
          price: 70,
          description: "Versão clássica em preto"
        },
        {
          id: "1b", 
          name: "X-Elite Vermelho",
          image: archeryEquipment,
          price: 75,
          description: "Versão especial em vermelho"
        },
        {
          id: "1c",
          name: "X-Elite Azul",
          image: bow-detail.jpg,
          price: 75,
          description: "Versão especial em azul"
        }
      ]
    },
    {
      id: "2", 
      name: "Kit Completo Iniciante Pro",
      price: 1299,
      originalPrice: 1599,
      image: archeryEquipment,
      description: "Kit completo para iniciantes com todos os acessórios necessários para começar no tiro com arco. Inclui arco recurvo de qualidade, flechas profissionais, proteções de segurança e manual completo de instruções.",
      category: "Kits",
      rating: 4.8,
      reviews: 89,
      features: ["Arco recurvo 68\"", "12 flechas de carbono", "Proteções incluídas", "Manual completo", "Suporte técnico"],
      inStock: true,
      variants: [
        {
          id: "2a",
          name: "Kit Iniciante 25lbs",
          image: archeryEquipment,
          price: 1299,
          description: "Para iniciantes - 25 libras"
        },
        {
          id: "2b",
          name: "Kit Iniciante 30lbs", 
          image: bow-detail.jpg,
          price: 1399,
          description: "Para intermediários - 30 libras"
        }
      ]
    },
    {
      id: "3",
      name: "Flechas de Carbono X-Precision",
      price: 349,
      image: archeryEquipment,
      description: "Flechas de carbono de altíssima qualidade para competições profissionais e treinos avançados. Fabricadas com carbono 100% puro para máxima precisão e durabilidade.",
      category: "Flechas",
      rating: 4.9,
      reviews: 203,
      features: ["100% Carbono", "Peso consistente", "Ponta intercambiável", "Spine preciso", "Aprovado para competições"],
      inStock: true,
      variants: [
        {
          id: "3a",
          name: "X-Precision 500",
          image: archeryEquipment,
          price: 349,
          description: "Spine 500 - Para arcos 25-35lbs"
        },
        {
          id: "3b",
          name: "X-Precision 400",
          image: x-puller.png,
          price: 369,
          description: "Spine 400 - Para arcos 35-45lbs"
        }
      ]
    },
    {
      id: "4",
      name: "Arco Recurvo Elite Carbon Pro",
      price: 2899,
      originalPrice: 3299,
      image: bow-detail.jpg,
      description: "Arco recurvo profissional de competição com tecnologia avançada em carbono. Aprovado pela World Archery para competições internacionais. Design inovador com sistema ILF para máxima versatilidade.",
      category: "Arcos",
      rating: 5.0,
      reviews: 45,
      features: ["World Archery Approved", "Carbono Premium", "Peso ajustável", "ILF System", "Garantia vitalícia"],
      isNew: true,
      inStock: true,
      variants: [
        {
          id: "4a",
          name: "Elite Carbon 68\"",
          image: bow-detail.jpg,
          price: 2899,
          description: "Tamanho padrão 68 polegadas"
        },
        {
          id: "4b",
          name: "Elite Carbon 70\"",
          image: archeryEquipment,
          price: 2999,
          description: "Tamanho longo 70 polegadas"
        }
      ]
    },
    {
      id: "5",
      name: "Protetor de Braço Leather Pro",
      price: 89,
      image: archeryEquipment,
      description: "Protetor de braço em couro premium com ajuste perfeito e máximo conforto. Essencial para proteção durante a prática do tiro com arco.",
      category: "Proteções",
      rating: 4.7,
      reviews: 156,
      features: ["Couro premium", "Ajuste perfeito", "Respirável", "Durável", "Confortável"],
      inStock: false,
      variants: [
        {
          id: "5a",
          name: "Leather Pro P",
          image: archeryEquipment,
          price: 89,
          description: "Tamanho P"
        },
        {
          id: "5b",
          name: "Leather Pro M",
          image: x-puller.png,
          price: 89,
          description: "Tamanho M"
        },
        {
          id: "5c",
          name: "Leather Pro G",
          image: bow-detail.jpg,
          price: 89,
          description: "Tamanho G"
        }
      ]
    },
    {
      id: "6",
      name: "Alvo Profissional 122cm",
      price: 299,
      image: archeryEquipment,
      description: "Alvo oficial para competições com cores vivas e durabilidade excepcional. Padrão FITA oficial para treinos e competições profissionais.",
      category: "Alvos",
      rating: 4.6,
      reviews: 78,
      features: ["Padrão FITA", "Resistente às intempéries", "122cm diâmetro", "Cores vivas", "Durável"],
      inStock: true,
      variants: [
        {
          id: "6a",
          name: "Alvo 122cm Standard",
          image: archeryEquipment,
          price: 299,
          description: "Versão padrão"
        },
        {
          id: "6b",
          name: "Alvo 122cm Premium",
          image: bow-detail.jpg,
          price: 349,
          description: "Versão premium com maior durabilidade"
        }
      ]
    }
  ];

  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-primary mb-4">Produto não encontrado</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariant] || {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    description: product.description
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = () => {
    const productToAdd: Product = {
      id: currentVariant.id,
      name: currentVariant.name,
      price: currentVariant.price,
      image: currentVariant.image,
      description: currentVariant.description
    };
    addItem(productToAdd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-navy-primary to-navy-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <Button 
              variant="outline" 
              className="mb-6 text-white border-white hover:bg-white hover:text-navy-primary"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Produtos
            </Button>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {product.name}
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Badge className="bg-coral-accent text-white">
                {product.category}
              </Badge>
              {product.isNew && (
                <Badge className="bg-white text-navy-primary">
                  Novo
                </Badge>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  Oferta
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-coral-accent text-coral-accent' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-lg">({product.reviews} avaliações)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={currentVariant.image} 
                    alt={currentVariant.name}
                    className="w-full h-96 object-cover"
                  />
                </CardContent>
              </Card>
              
              {/* Variant Selection */}
              {product.variants && product.variants.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-navy-primary mb-4">Opções Disponíveis:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {product.variants.map((variant, index) => (
                      <Card 
                        key={variant.id}
                        className={`cursor-pointer transition-all ${
                          selectedVariant === index 
                            ? 'ring-2 ring-coral-accent shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <CardContent className="p-3">
                          <img 
                            src={variant.image} 
                            alt={variant.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                          <p className="text-xs font-medium text-center">{variant.name}</p>
                          <p className="text-xs text-coral-accent text-center font-semibold">
                            {formatPrice(variant.price)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-navy-primary mb-4">{currentVariant.name}</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-coral-accent">{formatPrice(currentVariant.price)}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {currentVariant.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-navy-primary mb-4">Características:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-coral-accent rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-medium">Em estoque</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="font-medium">Fora de estoque</span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button 
                  variant="archery" 
                  size="lg" 
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProdutoDetalhesPage;

