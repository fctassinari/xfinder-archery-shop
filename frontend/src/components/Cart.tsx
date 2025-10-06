import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [freightOptions, setFreightOptions] = useState<any[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<any>(null);
  const [superfreteLabelInfo, setSuperfreteLabelInfo] = useState<any>(null);
  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);

  const cleanUrl = (value: string | undefined, fallback: string) => {
    if (!value) return fallback;
    let v = value.trim();
    // remove aspas iniciais/finais, ponto e vírgula finais e aspas escapadas
    v = v.replace(/^['"][\s]*/g, "").replace(/[\s]*['";]+$/g, "");
    v = v.replace(/\\"/g, '"').replace(/\\'/g, "'");
    return v || fallback;
  };

  const SUPERFRETE_API_URL = cleanUrl(import.meta.env.VITE_SUPERFRETE_API_URL, "http://localhost:8081/api/superfrete/calculate-freight");
  const CREATE_LABEL_URL = cleanUrl(import.meta.env.VITE_SUPERFRETE_CREATE_LABEL_URL, "http://localhost:8081/api/superfrete/create-label");

  const calculateFreight = async () => {
    const sanitizedCep = cep.replace(/\D/g, "");
    if (!sanitizedCep || sanitizedCep.length !== 8) {
      alert("Por favor, informe um CEP válido (8 dígitos).");
      return;
    }

    const productsForFreight = cart.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitary_value: item.product.price,
      weight: item.product.weight || 0.1,
      height: item.product.height || 10,
      width: item.product.width || 10,
      length: item.product.length || 10,
    }));

    setIsCalculatingFreight(true);
    try {
      const response = await axios.post(
        SUPERFRETE_API_URL,
        {
          cep: sanitizedCep,
          products: productsForFreight,
          insurance_value: cart.total,
          use_insurance_value: true,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const raw = response?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.services)
        ? raw.services
        : Array.isArray(raw?.results)
        ? raw.results
        : [];

      const normalized = list
        .map((opt: any) => {
          const companyName = opt.company_name || opt.company?.name || opt.company || "";
          const name = opt.name || opt.service_name || opt.service || opt.service_code || "Serviço";
          const price = Number(
            opt.price ?? opt.final_price ?? opt.total ?? opt.value ?? opt.amount ?? 0
          );
          const deliveryTime = Number(
            opt.delivery_time ??
              opt.delivery_days ??
              opt.delivery_range?.max ??
              opt.delivery_range?.min ??
              opt.delivery?.days ??
              0
          );
          const serviceCode = opt.service_code || opt.service?.code || name;
          const pkg = opt.package || opt.volume || opt.box || null;
          const pkgNorm = pkg
            ? {
                weight: Number(pkg.weight ?? pkg.peso ?? 0),
                height: Number(pkg.height ?? pkg.altura ?? 0),
                width: Number(pkg.width ?? pkg.largura ?? 0),
                length: Number(pkg.length ?? pkg.comprimento ?? 0),
              }
            : null;

          return {
            ...opt,
            company_name: companyName,
            name,
            price,
            delivery_time: deliveryTime,
            service_code: serviceCode,
            package: pkgNorm ?? undefined,
          };
        })
        .filter((o: any) => !Number.isNaN(o.price) && o.price >= 0)
        .sort((a: any, b: any) => a.price - b.price);

      if (normalized.length > 0) {
        setFreightOptions(normalized);
        setSelectedFreight(normalized[0]);
        setSuperfreteLabelInfo(normalized[0]?.package || null);
      } else {
        setFreightOptions([]);
        setSelectedFreight(null);
        setSuperfreteLabelInfo(null);
        alert("Nenhuma opção de frete encontrada para o CEP informado.");
      }
    } catch (error: any) {
      console.error("Erro ao calcular frete:", error?.response?.data || error);
      setFreightOptions([]);
      setSelectedFreight(null);
      setSuperfreteLabelInfo(null);
      alert("Erro ao calcular frete. Verifique o CEP e tente novamente.");
    } finally {
      setIsCalculatingFreight(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleClearCart = () => {
    clearCart();
    setCep("");
    setFreightOptions([]);
    setSelectedFreight(null);
    setSuperfreteLabelInfo(null);
  };

  const handleCheckout = () => {
    const items = cart.items.map(item => ({
      name: item.product.name,
      price: Math.round(item.product.price * 100),
      quantity: item.quantity,
    }));

    const redirectUrl = encodeURIComponent("https://xfinderarchery.com.br/compra");
    const totalWithFreight = cart.total + (selectedFreight ? selectedFreight.price : 0);
    const checkoutUrl = `https://checkout.infinitepay.io/fctassinari?items=${JSON.stringify(items)}&redirect_url=${redirectUrl}&total=${Math.round(totalWithFreight * 100)}`;
    
    window.location.href = checkoutUrl;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {cart.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
          <SheetDescription>
            {cart.itemCount > 0 
              ? `${cart.itemCount} ${cart.itemCount === 1 ? 'item' : 'itens'} no carrinho`
              : 'Seu carrinho está vazio'
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col flex-1 overflow-hidden">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione alguns produtos incríveis!
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                <div className="mb-4">
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP de Entrega</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="Digite seu CEP"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  />
                  <button 
                    className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={calculateFreight}
                    disabled={isCalculatingFreight}
                  >
                    {isCalculatingFreight ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculando...
                      </>
                    ) : (
                      "Calcular Frete"
                    )}
                  </button>
                </div>

                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 border-b pb-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                {freightOptions.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-md font-semibold">Opções de Frete:</h3>
                    {freightOptions.map((option) => (
                      <div
                        key={option.service_code}
                        className={`flex justify-between items-center p-3 border rounded-md cursor-pointer ${selectedFreight?.service_code === option.service_code ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => setSelectedFreight(option)}
                      >
                        <div>
                          <p className="font-semibold text-base">{option.company_name || option.company?.name}</p>
                          <p className="font-medium text-sm mt-1">{option.name}</p>
                          <p className="text-sm text-muted-foreground">Prazo: {option.delivery_time} dias úteis</p>
                        </div>
                        <span className="font-bold">{formatPrice(option.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedFreight && (
                  <div className="border-t pt-4 space-y-2">
                    <h3 className="text-md font-semibold">Informações para Etiqueta (Temporário):</h3>
                    <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
                      <p><strong>Serviço:</strong> {selectedFreight.name}</p>
                      <p><strong>Preço do Frete:</strong> {formatPrice(selectedFreight.price)}</p>
                      <p><strong>Prazo:</strong> {selectedFreight.delivery_time} dias úteis</p>
                      {superfreteLabelInfo && (
                        <div>
                          <p><strong>Dimensões da Caixa Ideal:</strong></p>
                          <div className="ml-2">
                            <p>• Peso: {superfreteLabelInfo.weight} kg</p>
                            <p>• Altura: {superfreteLabelInfo.height} cm</p>
                            <p>• Largura: {superfreteLabelInfo.width} cm</p>
                            <p>• Comprimento: {superfreteLabelInfo.length} cm</p>
                          </div>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t">
                        <p><strong>Dados para Emissão da Etiqueta:</strong></p>
                        <div className="ml-2">
                          <p>• CEP Destino: {cep}</p>
                          <p>• Valor Total: {formatPrice(cart.total)}</p>
                          <p>• Valor do Frete: {formatPrice(selectedFreight.price)}</p>
                          <p>• Total com Frete: {formatPrice(cart.total + selectedFreight.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 space-y-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total do Pedido:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(cart.total + (selectedFreight ? selectedFreight.price : 0))}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Finalizar Compra
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleClearCart}
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;