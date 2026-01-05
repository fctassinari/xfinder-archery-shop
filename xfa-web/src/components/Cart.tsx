import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { LoginButton } from "@/components/auth/LoginButton";
import apiClient from "@/services/apiClient";

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, customer, login, syncCustomer, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [freightOptions, setFreightOptions] = useState<any[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<any>(null);
  const [superfreteLabelInfo, setSuperfreteLabelInfo] = useState<any>(null);
  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customerExists, setCustomerExists] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [originalCustomerData, setOriginalCustomerData] = useState<any>(null);

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
  const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080";
  const SUPERFRETE_API_URL = cleanUrl(import.meta.env.VITE_SUPERFRETE_API_URL, `${API_BASE_URL}/api/superfrete/calculate-freight`);

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
        .filter((o: any) => {
          // Remove fretes com preço inválido
          if (Number.isNaN(o.price) || o.price < 0) return false;

          // Mantém sempre opções da XFinder (independente do preço)
          const isXFinder = o.company_name?.toLowerCase().includes('xfinder') ||
                           o.company?.name?.toLowerCase().includes('xfinder');

          // Mantém "Entrega em Mãos" mesmo com preço zero
          const isEntregaEmMaos = o.name?.toLowerCase().includes('entrega em mãos') ||
                                  o.name?.toLowerCase().includes('entrega em maos') ||
                                  o.name?.toLowerCase().includes('retirada');

          // Se for XFinder ou entrega em mãos, mantém; senão, só mantém se preço > 0
          return isXFinder || isEntregaEmMaos || o.price > 0;
        })
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

  const handleOpenCheckout = async () => {
    if (!selectedFreight) {
      alert("Por favor, selecione uma opção de frete antes de finalizar a compra.");
      return;
    }

    // Verificar se está autenticado
    if (!isAuthenticated) {
      alert("Por favor, faça login para finalizar a compra.");
      login();
      return;
    }

    console.log('🛒 Abrindo checkout, customer:', customer);
    console.log('🛒 isAuthenticated:', isAuthenticated);

    // Se customer não está disponível, tentar sincronizar primeiro
    if (!customer) {
      console.log('🔄 Customer não disponível, sincronizando...');
      setIsLoadingCustomer(true);
      try {
        await syncCustomer();
        console.log('✅ Sincronização iniciada, aguardando customer ser carregado...');
      } catch (error) {
        console.error('❌ Erro ao sincronizar customer:', error);
        setIsLoadingCustomer(false);
      }
    }

    // Não carregar dados aqui - o useEffect vai fazer isso quando o popup abrir e o customer estiver disponível
    // Apenas garantir que o CEP do frete seja usado se o customer não tiver CEP
    if (!customer?.cep) {
      setCustomerData(prev => ({ ...prev, cep: cep }));
    }

    setShowCheckoutPopup(true);
    setIsOpen(false); // Fecha o sheet do carrinho
  };

  // Carregar dados do cliente quando o popup de checkout abre e o customer está disponível
  useEffect(() => {
    if (showCheckoutPopup && isAuthenticated) {
      console.log('📦 Popup de checkout aberto, verificando customer:', customer);
      
      // Se customer está disponível, carregar os dados
      if (customer && customer.id) {
        console.log('✅ Customer encontrado, carregando dados:', customer);
        const loadedData = {
          name: customer.name || "",
          email: customer.email || "",
          phone: formatPhone(customer.phone || ""),
          cpf: formatCPF(customer.cpf || ""),
          cep: formatCEP(customer.cep || cep),
          address: customer.address || "",
          number: customer.number || "",
          complement: customer.complement || "",
          neighborhood: customer.neighborhood || "",
          city: customer.city || "",
          state: customer.state || ""
        };

        console.log('📦 Dados carregados no popup:', loadedData);
        setCustomerData(loadedData);
        setOriginalCustomerData(loadedData);
        setCustomerId(customer.id);
        setCustomerExists(true);
      } else if (!customer) {
        console.log('⚠️ Customer não disponível ainda (pode estar sincronizando)');
        // Se o customer não está disponível, pode estar sendo sincronizado
        // O useEffect vai executar novamente quando o customer for carregado
      }
    }
  }, [showCheckoutPopup, isAuthenticated, customer, cep]);

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;

    return true;
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setCustomerData(prev => ({ ...prev, cpf: formatted }));
    // Apenas atualizar o campo - não fazer busca automática
    // Os dados já foram carregados ao abrir o popup
  };

  const checkExistingCustomer = async (cpf: string) => {
    setIsLoadingCustomer(true);
    try {
      const customersApiUrl = import.meta.env.VITE_CUSTOMERS_API_URL || `${API_BASE_URL}/api/customers`;
      const response = await fetch(`${customersApiUrl}/cpf/${cpf}`);

      if (response.ok) {
        const customer = await response.json();

        // Preenche os dados do cliente existente
        const loadedData = {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          cpf: formatCPF(customer.cpf),
          cep: formatCEP(customer.cep),
          address: customer.address,
          number: customer.number,
          complement: customer.complement || "",
          neighborhood: customer.neighborhood,
          city: customer.city,
          state: customer.state
        };

        setCustomerData(loadedData);
        setOriginalCustomerData(loadedData); // Guarda dados originais para comparação
        setCustomerId(customer.id);
        setCustomerExists(true);
        //console.log('✅ Cliente encontrado:', customer.name, '- ID:', customer.id);
      } else {
        // Cliente não existe, limpa os campos (exceto CPF)
        setCustomerData(prev => ({
          ...prev,
          name: "",
          email: "",
          phone: "",
          cep: "",
          address: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: ""
        }));
        setOriginalCustomerData(null);
        setCustomerId(null);
        setCustomerExists(false);
        //console.log('ℹ️ Cliente não cadastrado, preencha os dados');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar cliente:', error);
      setCustomerExists(false);
      setOriginalCustomerData(null);
      setCustomerId(null);
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setCustomerData(prev => ({ ...prev, phone: formatted }));
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    setCustomerData(prev => ({ ...prev, cep: formatted }));
  };

  const validateCheckoutData = () => {
    const required = ['name', 'email', 'phone', 'cpf', 'cep', 'address', 'number', 'neighborhood', 'city', 'state'];
    for (const field of required) {
      if (!customerData[field as keyof typeof customerData]) {
        alert(`Por favor, preencha o campo ${field}`);
        return false;
      }
    }

    // Validação de CPF
    if (!validateCPF(customerData.cpf)) {
      alert("CPF inválido. Por favor, verifique o número digitado.");
      return false;
    }

    // Validação de telefone
    const phoneNumbers = customerData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      alert("Telefone inválido. Digite um número com DDD.");
      return false;
    }

    // Validação de CEP
    if (customerData.cep.replace(/\D/g, '').length !== 8) {
      alert("CEP deve ter 8 dígitos");
      return false;
    }

    // Validação de e-mail
    if (!customerData.email.includes('@') || !customerData.email.includes('.')) {
      alert("E-mail inválido");
      return false;
    }

    return true;
  };

  const hasCustomerDataChanged = () => {
    if (!originalCustomerData) return false;

    // Compara cada campo (limpando formatação para comparação justa)
    return (
      customerData.name !== originalCustomerData.name ||
      customerData.email !== originalCustomerData.email ||
      customerData.phone.replace(/\D/g, '') !== originalCustomerData.phone.replace(/\D/g, '') ||
      customerData.cep.replace(/\D/g, '') !== originalCustomerData.cep.replace(/\D/g, '') ||
      customerData.address !== originalCustomerData.address ||
      customerData.number !== originalCustomerData.number ||
      customerData.complement !== originalCustomerData.complement ||
      customerData.neighborhood !== originalCustomerData.neighborhood ||
      customerData.city !== originalCustomerData.city ||
      customerData.state !== originalCustomerData.state
    );
  };

  const handleConfirmCheckout = async () => {
    if (!validateCheckoutData()) return;

    // ========== MOCK PARA TESTE DE ETIQUETAS ==========
    // Para ativar o mock, defina VITE_USE_MOCK_CHECKOUT=true no .env
    // ou altere a linha abaixo para: const USE_MOCK = true;
    const USE_MOCK = import.meta.env.VITE_USE_MOCK_CHECKOUT === 'true' || false;
    
    if (USE_MOCK) {
      console.log('🧪 MODO MOCK ATIVADO - Testando fluxo de etiquetas');
      
      try {
        // Processar cliente (criar ou atualizar) - mesma lógica do original
        if (customerExists && customerId) {
          if (hasCustomerDataChanged()) {
            const customerPayload = {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone.replace(/\D/g, ''),
              cpf: customerData.cpf.replace(/\D/g, ''),
              cep: customerData.cep.replace(/\D/g, ''),
              address: customerData.address,
              number: customerData.number,
              complement: customerData.complement,
              neighborhood: customerData.neighborhood,
              city: customerData.city,
              state: customerData.state
            };

            const customersApiUrl = import.meta.env.VITE_CUSTOMERS_API_URL || `${API_BASE_URL}/api/customers`;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            const updateResponse = await fetch(`${customersApiUrl}/${customerId}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify(customerPayload)
            });

            if (!updateResponse.ok) {
              const errorText = await updateResponse.text();
              console.error('❌ Erro na resposta (texto):', errorText);
              try {
                const errorData = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' };
                alert(`Erro ao atualizar cadastro: ${errorData.error || 'Erro desconhecido'}`);
              } catch {
                alert(`Erro ao atualizar cadastro: ${errorText || 'Erro desconhecido'}`);
              }
              return;
            }
          }
        } else {
          const customerPayload = {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone.replace(/\D/g, ''),
            cpf: customerData.cpf.replace(/\D/g, ''),
            cep: customerData.cep.replace(/\D/g, ''),
            address: customerData.address,
            number: customerData.number,
            complement: customerData.complement,
            neighborhood: customerData.neighborhood,
            city: customerData.city,
            state: customerData.state
          };

          const customersApiUrl = import.meta.env.VITE_CUSTOMERS_API_URL || `${API_BASE_URL}/api/customers`;
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          const customerResponse = await fetch(customersApiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(customerPayload)
          });

          if (!customerResponse.ok) {
            const errorText = await customerResponse.text();
            console.error('❌ Erro na resposta (texto):', errorText);
            try {
              const errorData = JSON.parse(errorText);
              alert(`Erro ao cadastrar cliente: ${errorData.error || 'Erro desconhecido'}`);
            } catch {
              alert(`Erro ao cadastrar cliente: ${errorText}`);
            }
            return;
          }
        }

        // Preparar dados do pedido
        const orderData = {
          customer: customerData,
          items: cart.items,
          freight: selectedFreight,
          total: cart.total,
          freightCost: selectedFreight.price,
          totalWithFreight: cart.total + selectedFreight.price,
          orderDate: new Date().toISOString()
        };

        // Salvar dados do pedido no sessionStorage
        sessionStorage.setItem('orderData', JSON.stringify(orderData));

        // Simular dados de pagamento bem-sucedido
        const mockPaymentParams = new URLSearchParams({
          transaction_id: `MOCK-TX-${Date.now()}`,
          transaction_nsu: `MOCK-NSU-${Date.now()}`,
          order_nsu: `MOCK-ORDER-${Date.now()}`,
          slug: 'mock-slug',
          capture_method: 'pix',
          receipt_url: 'https://example.com/receipt.pdf'
        });

        // Redirecionar para a página de compra com parâmetros mockados
        const mockCheckoutUrl = `${APP_BASE_URL}/compra?${mockPaymentParams.toString()}`;
        console.log('🧪 Redirecionando para:', mockCheckoutUrl);
        window.location.href = mockCheckoutUrl;
        return;
      } catch (error) {
        console.error('❌ Erro no mock de checkout:', error);
        alert('Erro ao processar checkout mock. Tente novamente.');
        return;
      }
    }
    // ========== FIM DO MOCK ==========

    // ========== CÓDIGO ORIGINAL (PRODUÇÃO) ==========
    try {
      if (customerExists && customerId) {
        // Cliente existe - verificar se houve alterações
        if (hasCustomerDataChanged()) {
          //console.log('📝 Atualizando cadastro do cliente...');
          const customerPayload = {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone.replace(/\D/g, ''),
            cpf: customerData.cpf.replace(/\D/g, ''),
            cep: customerData.cep.replace(/\D/g, ''),
            address: customerData.address,
            number: customerData.number,
            complement: customerData.complement,
            neighborhood: customerData.neighborhood,
            city: customerData.city,
            state: customerData.state
          };

          //console.log('📤 Enviando atualização:', customerPayload);

          const customersApiUrl = import.meta.env.VITE_CUSTOMERS_API_URL || `${API_BASE_URL}/api/customers`;
          const headers: HeadersInit = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          const updateResponse = await fetch(`${customersApiUrl}/${customerId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(customerPayload)
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('❌ Erro na resposta (texto):', errorText);
            try {
              const errorData = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' };
              alert(`Erro ao atualizar cadastro: ${errorData.error || 'Erro desconhecido'}`);
            } catch {
              alert(`Erro ao atualizar cadastro: ${errorText || 'Erro desconhecido'}`);
            }
            return;
          }

          // Só tentar fazer parse JSON se houver conteúdo
          const responseText = await updateResponse.text();
          const updatedCustomer = responseText ? JSON.parse(responseText) : null;
          //console.log('✅ Cadastro atualizado com sucesso! ID:', updatedCustomer.id);
        } else {
          //console.log('ℹ️ Nenhuma alteração detectada, prosseguindo com a compra');
        }
      } else {
        // Cliente não existe - criar novo cadastro
        //console.log('📝 Criando novo cadastro de cliente...');
        //console.log('🔍 customerExists:', customerExists);
        //console.log('🔍 customerId:', customerId);

        const customerPayload = {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone.replace(/\D/g, ''),
          cpf: customerData.cpf.replace(/\D/g, ''),
          cep: customerData.cep.replace(/\D/g, ''),
          address: customerData.address,
          number: customerData.number,
          complement: customerData.complement,
          neighborhood: customerData.neighborhood,
          city: customerData.city,
          state: customerData.state
        };

        //console.log('📤 Enviando novo cliente:', customerPayload);

        const customersApiUrl = import.meta.env.VITE_CUSTOMERS_API_URL || `${API_BASE_URL}/api/customers`;
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const customerResponse = await fetch(customersApiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(customerPayload)
        });

        //console.log('📥 Status da resposta:', customerResponse.status);

        if (!customerResponse.ok) {
          const errorText = await customerResponse.text();
          console.error('❌ Erro na resposta (texto):', errorText);
          try {
            const errorData = JSON.parse(errorText);
            alert(`Erro ao cadastrar cliente: ${errorData.error || 'Erro desconhecido'}`);
          } catch {
            alert(`Erro ao cadastrar cliente: ${errorText}`);
          }
          return;
        }

        // Só tentar fazer parse JSON se houver conteúdo
        const responseText = await customerResponse.text();
        const createdCustomer = responseText ? JSON.parse(responseText) : null;
        //console.log('✅ Cliente cadastrado com sucesso!', createdCustomer);
      }

      // Continua com o fluxo de checkout
      //console.log('🛒 Prosseguindo com o checkout...');

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
      const baseUrl = import.meta.env.VITE_CHECKOUT_BASE_URL || "https://checkout.infinitepay.io/fctassinari";
      const searchParams = new URLSearchParams();

      searchParams.append('items', JSON.stringify(items));
      searchParams.append('redirect_url', `${APP_BASE_URL}/compra`);
      searchParams.append('customer_name', customerData.name);
      searchParams.append('customer_email', customerData.email);
      searchParams.append('customer_cellphone', customerData.phone.replace(/\D/g, ''));
      searchParams.append('address_cep', customerData.cep.replace(/\D/g, ''));
      searchParams.append('address_complement', customerData.complement || '');
      searchParams.append('address_number', customerData.number);

      const checkoutUrl = `${baseUrl}?${searchParams.toString()}`;

      //console.log('✅ URL checkout gerada:', checkoutUrl);
      //console.log('📦 Items:', JSON.stringify(items, null, 2));

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('❌ Erro ao processar checkout:', error);
      alert('Erro ao processar o checkout. Tente novamente.');
    }
    // ========== FIM DO CÓDIGO ORIGINAL ==========
  };

  // Verificar autenticação ao abrir o carrinho
  const handleCartOpen = (open: boolean) => {
    if (open && !isAuthenticated) {
      // Se tentar abrir o carrinho sem estar autenticado, redirecionar para login
      setIsOpen(false);
      login();
      return;
    }
    setIsOpen(open);
  };

  // Carregar CEP do cliente quando o carrinho abre e o cliente está logado
  useEffect(() => {
    if (isOpen && isAuthenticated && customer?.cep) {
      console.log('📍 Carregando CEP do cliente no carrinho:', customer.cep);
      const formattedCep = formatCEP(customer.cep);
      setCep(formattedCep);
    }
  }, [isOpen, isAuthenticated, customer?.cep]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleCartOpen}>
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
                      className="w-full hidden"
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

                {/* CPF como primeiro campo */}
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="000.000.000-00"
                    value={customerData.cpf}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    maxLength={14}
                  />
                  {customerData.cpf.replace(/\D/g, '').length === 11 && (
                    <p className="text-sm text-blue-600 mt-2">✅ Se for necessário, atualize seus dados aqui.</p>
                  )}
                </div>

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
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      maxLength={15}
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
                      onChange={(e) => handleCEPChange(e.target.value)}
                      maxLength={9}
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