import { useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, X } from "lucide-react";
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
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

  // Dados do cliente
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const cleanUrl = (value: string | undefined, fallback: string) => {
    if (!value) return fallback;
    let v = value.trim();
    v = v.replace(/^['"][\s]*/g, "").replace(/[\s]*['";]+$/g, "");
    v = v.replace(/\\"/g, '"').replace(/\\'/g, "'");
    return v || fallback;
  };

  const SUPERFRETE_API_URL = cleanUrl(import.meta.env.VITE_SUPERFRETE_API_URL, "http://localhost:8081/api/superfrete/calculate-freight");

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
      const response = await fetch(SUPERFRETE_API_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: sanitizedCep,
          products: productsForFreight,
          insurance_value: cart.total,
          use_insurance_value: true,
        })
      });

      const raw = await response.json();
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
          const deliveryTime =
            opt.delivery_time ??
              opt.delivery_days ??
              opt.delivery_range?.max ??
              opt.delivery_range?.min ??
              opt.delivery?.days ??
              "0";
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
      console.error("Erro ao calcular frete:", error);
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

  const handleOpenCheckout = () => {
    if (!selectedFreight) {
      alert("Por favor, selecione uma opção de frete antes de finalizar a compra.");
      return;
    }
    setCustomerData(prev => ({ ...prev, cep: cep }));
    setShowCheckoutPopup(true);
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const validateCheckoutData = () => {
    const required = ['name', 'email', 'phone', 'cpf', 'cep', 'address', 'number', 'neighborhood', 'city', 'state'];
    for (const field of required) {
      if (!customerData[field as keyof typeof customerData]) {
        alert(`Por favor, preencha o campo ${field}`);
        return false;
      }
    }

    if (customerData.cpf.replace(/\D/g, '').length !== 11) {
      alert("CPF deve ter 11 dígitos");
      return false;
    }

    if (customerData.cep.replace(/\D/g, '').length !== 8) {
      alert("CEP deve ter 8 dígitos");
      return false;
    }

    if (!customerData.email.includes('@')) {
      alert("E-mail inválido");
      return false;
    }

    return true;
  };

  const handleConfirmCheckout = () => {
    if (!validateCheckoutData()) return;

    const orderData = {
      customer: customerData,
      items: cart.items,
      freight: selectedFreight,
      total: cart.total,
      freightCost: selectedFreight.price,
      totalWithFreight: cart.total + selectedFreight.price,
      orderDate: new Date().toISOString()
    };

    sessionStorage.setItem('orderData', JSON.stringify(orderData));

    // IMPORTANTE: InfinitePay usa "price" não "amount"
    const items = cart.items.map(item => ({
      name: item.product.name,
      price: Math.round(item.product.price * 100),
      quantity: item.quantity,
    }));

    // Adiciona o frete como item separado
    if (selectedFreight && selectedFreight.price > 0) {
      items.push({
        name: `Frete - ${selectedFreight.name} (${selectedFreight.company_name || ''})`,
        price: Math.round(selectedFreight.price * 100),
        quantity: 1,
      });
    }

    // Monta a URL usando URLSearchParams para encoding correto
    const baseUrl = "https://checkout.infinitepay.io/fctassinari";
    const searchParams = new URLSearchParams();

    searchParams.append('items', JSON.stringify(items));
    searchParams.append('redirect_url', "http://localhost:8080/compra");
    searchParams.append('customer_name', customerData.name);
    searchParams.append('customer_email', customerData.email);
    searchParams.append('customer_cellphone', customerData.phone.replace(/\D/g, ''));
    searchParams.append('address_cep', customerData.cep.replace(/\D/g, ''));
    searchParams.append('address_complement', customerData.complement || '');
    searchParams.append('address_number', customerData.number);

    const checkoutUrl = `${baseUrl}?${searchParams.toString()}`;

    console.log('✅ URL checkout gerada:', checkoutUrl);
    console.log('📦 Items:', JSON.stringify(items, null, 2));
    window.location.href = checkoutUrl;
  };

  return (
    <>
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
                            <p className="text-sm text-muted-foreground">Prazo: {option.delivery_time}{option.delivery_time !== "A combinar" ? " dias úteis" : ""}</p>
                          </div>
                          <span className="font-bold">{formatPrice(option.price)}</span>
                        </div>
                      ))}
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
                    <Button className="w-full" size="lg" onClick={handleOpenCheckout}>
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

      {showCheckoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Finalizar Compra</h2>
              <button onClick={() => setShowCheckoutPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Dados Cadastrais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="(11) 99999-9999"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="000.000.000-00"
                      value={customerData.cpf}
                      onChange={(e) => handleCustomerDataChange('cpf', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="00000-000"
                      value={customerData.cep}
                      onChange={(e) => handleCustomerDataChange('cep', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="SP"
                      maxLength={2}
                      value={customerData.state}
                      onChange={(e) => handleCustomerDataChange('state', e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerData.city}
                      onChange={(e) => handleCustomerDataChange('city', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Rua, Avenida..."
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerData.number}
                      onChange={(e) => handleCustomerDataChange('number', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Apto, Bloco..."
                      value={customerData.complement}
                      onChange={(e) => handleCustomerDataChange('complement', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerData.neighborhood}
                      onChange={(e) => handleCustomerDataChange('neighborhood', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Resumo do Pedido</h3>
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}

                  {selectedFreight && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Subtotal:</span>
                          <span>{formatPrice(cart.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Frete ({selectedFreight.name}):</span>
                          <span>{formatPrice(selectedFreight.price)}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Prazo: {selectedFreight.delivery_time}{selectedFreight.delivery_time !== "A combinar" ? " dias úteis" : ""}
                        </div>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-indigo-600">{formatPrice(cart.total + selectedFreight.price)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCheckoutPopup(false)}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleConfirmCheckout}
                >
                  Confirmar e Pagar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;