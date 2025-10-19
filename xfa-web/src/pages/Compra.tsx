import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import heroImage from "@/assets/nocks.jpeg";
import { CheckCircle, XCircle, Clock, Package, User, MapPin, CreditCard } from 'lucide-react';

const Compra = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');
  const [orderData, setOrderData] = useState<any>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>('');

  useEffect(() => {
    // Recupera os dados do pedido da sessão
    const storedOrderData = sessionStorage.getItem('orderData');
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    }

    const params = new URLSearchParams(location.search);
    const transaction_id = params.get('transaction_id');
    const transaction_nsu = params.get('transaction_nsu');
    const order_nsu = params.get('order_nsu');
    const slug = params.get('slug');
    const capture_method = params.get('capture_method');
    const receipt_url = params.get('receipt_url');

    console.log('✅ Parâmetros recebidos da InfinitePay:', {
      transaction_id,
      transaction_nsu,
      order_nsu,
      slug,
      capture_method,
      receipt_url
    });

    // Armazena a URL do recibo se disponível
    if (receipt_url) {
      setReceiptUrl(decodeURIComponent(receipt_url));
    }

    if (transaction_nsu && order_nsu && slug) {
      const checkPayment = async () => {
        try {
          // Chama a API de verificação de pagamento
          const apiUrl = `https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=${transaction_nsu}&external_order_nsu=${order_nsu}&slug=${slug}`;
          console.log('🔍 Verificando pagamento na URL:', apiUrl);

          // ⚠️ DESENVOLVIMENTO: Simula resposta para evitar erro de CORS em localhost
          // Descomente a linha abaixo quando estiver em produção
          // const response = await fetch(apiUrl);
          // const data = await response.json();

          // 🧪 MOCK para testes em localhost (remover em produção)
          const data = {"success":true,"paid":true,"amount":400,"paid_amount":400,"installments":1,"capture_method":"pix"};
          console.log('🧪 Usando dados simulados (MOCK):', data);

          console.log('📊 Resposta da API:', data);

          if (data.success && data.paid) {
            setPaymentStatus('success');
            console.log('✅ Pagamento confirmado com sucesso!');
          } else {
            setPaymentStatus('failure');
            console.log('❌ Pagamento não confirmado');
          }
        } catch (error) {
          console.error('❌ Erro ao verificar o pagamento:', error);
          setPaymentStatus('failure');
        }
      };
      checkPayment();
    } else {
      setPaymentStatus('failure');
    }
  }, [location]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="container mx-auto px-4">
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Confirmação de Pedido
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Obrigado por escolher nossos produtos de tiro com arco!
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {paymentStatus === 'pending' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando status do pagamento...</h2>
              <p className="text-gray-600">Por favor, aguarde enquanto confirmamos seu pagamento.</p>
            </div>
          )}

          {paymentStatus === 'success' && orderData && (
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-800 mb-2">Compra Realizada com Sucesso!</h2>
                <p className="text-lg text-green-700">Seu pagamento foi confirmado e seu pedido está sendo processado.</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Dados do Cliente</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nome:</p>
                    <p className="font-semibold">{orderData.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">E-mail:</p>
                    <p className="font-semibold">{orderData.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telefone:</p>
                    <p className="font-semibold">{orderData.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CPF:</p>
                    <p className="font-semibold">{orderData.customer.cpf}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Data do Pedido:</p>
                    <p className="font-semibold">{formatDate(orderData.orderDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Endereço de Entrega</h3>
                </div>
                <div className="text-sm space-y-2">
                  <p className="font-semibold">
                    {orderData.customer.address}, {orderData.customer.number}
                    {orderData.customer.complement && ` - ${orderData.customer.complement}`}
                  </p>
                  <p>{orderData.customer.neighborhood}</p>
                  <p>{orderData.customer.city} - {orderData.customer.state}</p>
                  <p>CEP: {orderData.customer.cep}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Itens do Pedido</h3>
                </div>
                <div className="space-y-3">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Preço unitário: {formatPrice(item.product.price)}</p>
                        </div>
                      </div>
                      <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Resumo do Pagamento</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal dos Produtos:</span>
                    <span className="font-semibold">{formatPrice(orderData.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete ({orderData.freight.name}):</span>
                    <span className="font-semibold">{formatPrice(orderData.freightCost)}</span>
                  </div>
                  {orderData.freight.delivery_time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Prazo de Entrega:</span>
                      <span className="font-semibold">
                        {orderData.freight.delivery_time}
                        {orderData.freight.delivery_time !== "A combinar" ? " dias úteis" : ""}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total Pago:</span>
                    <span className="text-green-600">{formatPrice(orderData.totalWithFreight)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">Próximos Passos:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>Você receberá um e-mail de confirmação em {orderData.customer.email}</li>
                  <li>Acompanhe o status do seu pedido pelo e-mail cadastrado</li>
                  <li>Em caso de dúvidas, entre em contato pelo WhatsApp</li>
                  <li>Seu pedido será enviado para o endereço informado</li>
                </ul>

                {receiptUrl && (
                  <div className="mt-4">
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      📄 Ver Comprovante de Pagamento
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentStatus === 'failure' && (
            <div className="space-y-6">
              <div className="bg-red-50 border-2 border-red-500 rounded-lg shadow-lg p-8 text-center">
                <XCircle className="h-20 w-20 text-red-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-800 mb-2">Problemas com o Pagamento</h2>
                <p className="text-lg text-red-700 mb-4">
                  Não foi possível confirmar seu pagamento. Por favor, tente novamente ou entre em contato.
                </p>
              </div>

              {orderData && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhes da Tentativa</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Cliente:</span> {orderData.customer.name}</p>
                    <p><span className="font-semibold">E-mail:</span> {orderData.customer.email}</p>
                    <p><span className="font-semibold">Valor Total:</span> {formatPrice(orderData.totalWithFreight)}</p>
                    <p><span className="font-semibold">Data:</span> {formatDate(orderData.orderDate)}</p>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Sugestões:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                      <li>Verifique sua conexão com a internet</li>
                      <li>Confirme os dados do cartão ou método de pagamento</li>
                      <li>Entre em contato com seu banco</li>
                      <li>Tente novamente em alguns minutos</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="text-center">
                <a
                  href="/"
                  className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Voltar à Loja
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Compra;