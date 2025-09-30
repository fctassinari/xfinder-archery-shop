import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft, Loader2, AlertTriangle, Package, Ruler, Scale } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";

// Re-define a interface ApiProduct baseada na estrutura da API Java
interface ApiProduct extends Product {
  // Campos obrigatórios da Product.java
  category: string;
  rating: number; // Mapeado para Double do Java
  reviews: number; // Mapeado para Integer do Java
  features: string[];
  inStock: boolean;

  // Campos opcionais da Product.java
  originalPrice?: number; // Mapeado para Double do Java
  isNew?: boolean; // Mapeado para Boolean do Java
  weight?: number; // Mapeado para Double do Java
  height?: number; // Mapeado para Double do Java
  width?: number; // Mapeado para Double do Java
  length?: number; // Mapeado para Double do Java

  // Mantido 'variants' opcional
  variants?: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
  }>;
}

const ProdutoDetalhesPage = () => {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Estados para buscar dados dinâmicos
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtém o 'id' da URL
  const productId = searchParams.get('id');

  useEffect(() => {
    if (!productId) {
      setError("Código do produto não fornecido na URL.");
      setLoading(false);
      return;
    }

    // 🔑 CORREÇÃO CRÍTICA: Definir a URL base explicitamente, assim como na ProductsPage.tsx
    // Usando a variável de ambiente (melhor prática) ou fallback para a porta 8081
    // Nota: O endpoint de um produto específico é 'products/{id}', sem o '/api/products' no fim do baseUrl.
    const BASE_API_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8081/api/products';

    // Constrói a URL completa para o produto específico
    const apiUrl = `${BASE_API_URL}/${productId}`;


    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        // Usa a URL ABSOLUTA construída
        const response = await fetch(apiUrl);
        let data: ApiProduct;

        if (!response.ok) {
          // Trata status de erro (404, 500, etc.)
          if (response.status === 404) {
             throw new Error(`Produto com ID '${productId}' não foi encontrado.`);
          }
          // Para outros erros (ex: 500, servidor indisponível)
          throw new Error(`Erro de rede ou servidor: Código ${response.status}.`);
        }

        try {
            // Tenta ler o JSON: O erro "<!DOCTYPE" não deve mais ocorrer!
            data = await response.json();
        } catch (jsonError) {
            // Se o erro de parsing ocorrer (e não deveria mais), avisa o usuário
            console.error("Erro ao analisar JSON. Resposta pode não ser JSON:", jsonError);
            throw new Error("Resposta inesperada do servidor. O formato de dados está incorreto (esperado JSON).");
        }

        setProduct(data);

      } catch (err: any) {
        console.error("Erro ao buscar detalhes do produto:", err);
        setError(err.message || "Não foi possível carregar os detalhes do produto devido a um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Lógica de manipulação de estados (loading, error, product) e renderização...

  // Função para formatar preços
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Lógica de manipulação de carrinho (usa o produto dinâmico)
  const handleAddToCart = () => {
    // Adiciona o produto principal ao carrinho
    if (product) {
        addItem(product as Product);
    }
  };

  // Seleciona o produto/variante a ser exibido
  const selectedProduct = product && product.variants ? product.variants[selectedVariant] : product;

  // Lógica para lidar com o loading
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px] flex-col">
            <Loader2 className="h-10 w-10 animate-spin text-navy-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Carregando detalhes do produto...</p>
        </div>
    );
  }

  // Lógica para lidar com erros
  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[400px] flex-col p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <h2 className="text-xl font-bold mt-4">Erro ao Carregar Produto</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button className="mt-6" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
        </div>
    );
  }

  // Fallback seguro caso 'product' seja null
  if (!product) {
    return (
        <div className="flex items-center justify-center min-h-[400px] flex-col p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
            <h2 className="text-xl font-bold mt-4">Produto Indisponível</h2>
            <p className="text-muted-foreground mt-2">O produto com código '{productId}' não foi encontrado ou está temporariamente indisponível.</p>
            <Button className="mt-6" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
        </div>
    );
  }

  // Início da renderização do produto...
  return (
    <div className="pt-20 pb-12 bg-gray-50/50">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-navy-primary hover:text-navy-secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a Lista de Produtos
        </Button>

        {/* Detalhes do Produto */}
        <div className="bg-white shadow-lg rounded-xl p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Imagem do Produto */}
            <div className="lg:w-1/2 flex justify-center items-center">
              <img
                src={selectedProduct!.image}
                alt={selectedProduct!.name}
                className="rounded-lg shadow-md max-h-[500px] object-contain w-full"
              />
            </div>

            {/* Informações do Produto */}
            <div className="lg:w-1/2">
              <div className="space-y-4">
                {/* Cabeçalho */}
                <h1 className="text-4xl font-extrabold text-gray-900">{selectedProduct!.name}</h1>

                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-600 font-medium">
                    {product.category}
                  </Badge>
                  {product.isNew && (
                    <Badge variant="default" className="bg-teal-500 hover:bg-teal-600">
                      Novo
                    </Badge>
                  )}
                </div>

                {/* Preço */}
                <div className="flex items-baseline space-x-3">
                    {product.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                    <span className="text-4xl font-bold text-navy-primary">
                        {formatPrice(selectedProduct!.price)}
                    </span>
                </div>

                {/* Avaliação */}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {product.rating.toFixed(1)} ({product.reviews} avaliações)
                  </span>
                </div>

                {/* Descrição */}
                <p className="text-gray-600 leading-relaxed pt-2">{selectedProduct!.description}</p>

                {/* Seção de Variantes (mantida) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Variantes</h3>
                    <div className="flex space-x-3">
                      {product.variants.map((variant, index) => (
                        <Card
                          key={variant.id}
                          className={`cursor-pointer transition-all ${selectedVariant === index ? 'border-navy-primary ring-2 ring-navy-primary' : 'border-gray-200'}`}
                          onClick={() => setSelectedVariant(index)}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="text-sm font-medium">{variant.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Especificações Técnicas (Campos da API Java) */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Especificações</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        {product.weight && (
                            <div className="flex items-center space-x-2">
                                <Scale className="h-4 w-4 text-navy-primary" />
                                <span>Peso: {product.weight} kg</span>
                            </div>
                        )}
                        {product.height && product.width && product.length && (
                            <div className="flex items-center space-x-2">
                                <Ruler className="h-4 w-4 text-navy-primary" />
                                <span>Dimensões: {product.length}x{product.width}x{product.height} cm</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-navy-primary" />
                            <span>Código: {product.id}</span>
                        </div>
                    </div>
                </div>


                {/* Características Principais */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Características</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-navy-primary">✓</span>
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