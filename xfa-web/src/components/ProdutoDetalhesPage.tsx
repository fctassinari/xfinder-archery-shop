import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft, Loader2, AlertTriangle, Package, Ruler, Scale } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/cart";
import { getApiConfig } from "@/config/appConfig";

// Re-define a interface ApiProduct baseada na estrutura da API Java
interface ApiProduct extends Product {
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  originalPrice?: number;
  isNew?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  qtd?: number;
  variants?: ApiProduct[];
}

const ProdutoDetalhesPage = () => {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(0);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = searchParams.get('id');

  // Função para garantir dados seguros
  const safeProduct = (productData: any): ApiProduct => ({
    id: String(productData?.id || ''),
    name: productData?.name || 'Produto sem nome',
    price: productData?.price || 0,
    image: productData?.image || '/placeholder.svg',
    description: productData?.description || 'Descrição não disponível',
    category: productData?.category || 'Geral',
    rating: productData?.rating || 0,
    reviews: productData?.reviews || 0,
    features: productData?.features || [],
    originalPrice: productData?.originalPrice,
    isNew: productData?.isNew || false,
    inStock: productData?.inStock !== undefined ? productData.inStock : true,
    weight: productData?.weight,
    height: productData?.height,
    width: productData?.width,
    length: productData?.length,
    qtd: productData?.qtd,
    variants: productData?.variants?.filter((v: any) => v !== undefined && v !== null).map((v: any) => safeProduct(v)) || []
  });

  useEffect(() => {
    if (!productId) {
      setError("Código do produto não fornecido na URL.");
      setLoading(false);
      return;
    }

    const BASE_API_URL = getApiConfig().productsUrl;
    const apiUrl = `${BASE_API_URL}/${productId}`;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const response = await fetch(apiUrl);
        let data: ApiProduct;

        if (!response.ok) {
          if (response.status === 404) {
             throw new Error(`Produto com ID '${productId}' não foi encontrado.`);
          }
          throw new Error(`Erro de rede ou servidor: Código ${response.status}.`);
        }

        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Erro ao analisar JSON. Resposta pode não ser JSON:", jsonError);
            throw new Error("Resposta inesperada do servidor. O formato de dados está incorreto (esperado JSON).");
        }

        console.log('🔍 Produto carregado:', data);
        console.log('🔍 Variantes:', data?.variants);

        // Usa safeProduct para garantir dados consistentes
        const safeProductData = safeProduct(data);
        console.log('🔍 Produto seguro:', safeProductData);

        setProduct(safeProductData);

      } catch (err: any) {
        console.error("Erro ao buscar detalhes do produto:", err);
        setError(err.message || "Não foi possível carregar os detalhes do produto devido a um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // CORREÇÃO: Função segura para obter produto selecionado
  const getSelectedProduct = (): ApiProduct | null => {
    if (!product) return null;

    // Se tem variantes e selectedVariant é válido, retorna a variante
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[selectedVariant];
      if (variant) {
        return variant;
      }
      // Fallback para primeira variante válida
      const firstValidVariant = product.variants.find(v => v !== undefined);
      return firstValidVariant || product;
    }

    // Se não tem variantes, retorna o produto principal
    return product;
  };

  const selectedProduct = getSelectedProduct();

  // CORREÇÃO: Função para obter variantes válidas
  const getValidVariants = () => {
    if (!product?.variants) return [];
    return product.variants.filter(variant =>
      variant !== undefined &&
      variant !== null &&
      variant.image !== undefined
    );
  };

  const validVariants = getValidVariants();
  const hasValidVariants = validVariants.length > 0;

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px] flex-col">
            <Loader2 className="h-10 w-10 animate-spin text-navy-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Carregando detalhes do produto...</p>
        </div>
    );
  }

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

  if (!product || !selectedProduct) {
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

        <div className="bg-white shadow-lg rounded-xl p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="flex justify-center items-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="rounded-lg shadow-md max-h-[500px] object-contain w-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>

              {/* CORREÇÃO: Usa apenas variantes válidas */}
              {hasValidVariants && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Variantes Disponíveis</h3>
                  <div className="flex flex-wrap gap-3">
                    {validVariants.map((variant, index) => (
                      <Card
                        key={variant.id || index}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedVariant === index
                            ? 'border-navy-primary ring-2 ring-navy-primary'
                            : 'border-gray-200 hover:border-navy-secondary'
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <CardContent className="p-2 flex flex-col items-center">
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded border">
                            <img
                              src={variant.image}
                              alt={variant.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Imagem';
                                e.currentTarget.className = 'w-16 h-16 object-contain opacity-50';
                              }}
                            />
                          </div>
                          <span className="text-xs mt-1 text-center font-medium text-gray-700 max-w-20 truncate">
                            {variant.name}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-1/2">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900">{selectedProduct.name}</h1>

                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-600 font-medium">
                    {selectedProduct.category}
                  </Badge>
                  {selectedProduct.isNew && (
                    <Badge variant="default" className="bg-teal-500 hover:bg-teal-600">
                      Novo
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline space-x-3">
                  {selectedProduct.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-navy-primary">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(selectedProduct.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} avaliações)
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed pt-2">{selectedProduct.description}</p>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Especificações</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    {selectedProduct.weight && (
                      <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 text-navy-primary" />
                        <span>Peso: {selectedProduct.weight} kg</span>
                      </div>
                    )}
                    {selectedProduct.height && selectedProduct.width && selectedProduct.length && (
                      <div className="flex items-center space-x-2">
                        <Ruler className="h-4 w-4 text-navy-primary" />
                        <span>Dimensões: {selectedProduct.length}x{selectedProduct.width}x{selectedProduct.height} cm</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-navy-primary" />
                      <span>Código: {selectedProduct.id}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Características</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-navy-primary">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  {selectedProduct.inStock ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-medium">
                        Em estoque
                        {selectedProduct.qtd !== undefined && ` - ${selectedProduct.qtd} unidade${selectedProduct.qtd !== 1 ? 's' : ''} disponível${selectedProduct.qtd !== 1 ? 'is' : ''}`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="font-medium">Fora de estoque</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="archery"
                  size="lg"
                  className="w-full"
                  onClick={() => selectedProduct.inStock && addItem(selectedProduct as Product)}
                  disabled={!selectedProduct.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {selectedProduct.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
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