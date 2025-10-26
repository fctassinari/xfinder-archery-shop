import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import heroImage from "@/assets/nocks.jpeg";
import { CheckCircle, XCircle, Clock, Package, User, MapPin, CreditCard } from 'lucide-react';
import { useCart } from "@/contexts/CartContext";

const Compra = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');
  const [orderData, setOrderData] = useState<any>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>('');

  useEffect(() => {
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

    if (receipt_url) {
      setReceiptUrl(decodeURIComponent(receipt_url));
    }

    // Flag para garantir execução única
    const isProcessed = sessionStorage.getItem('orderProcessed');

    if (transaction_nsu && order_nsu && slug && !isProcessed) {
      const checkPayment = async () => {
        try {
          // Marcar como processado IMEDIATAMENTE para evitar loop
          sessionStorage.setItem('orderProcessed', 'true');

          const apiUrl = `https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=${transaction_nsu}&external_order_nsu=${order_nsu}&slug=${slug}`;
          console.log('🔍 Verificando pagamento na URL:', apiUrl);

//           const response = await fetch(apiUrl);
//           const data = await response.json();

          const data = {"success":true,"paid":true,"amount":400,"paid_amount":400,"installments":1,"capture_method":"pix"};
          console.log('🧪 Usando dados simulados (MOCK):', data);

          console.log('📊 Resposta da API:', data);

          if (data.success && data.paid) {
            setPaymentStatus('success');
            console.log('✅ Pagamento confirmado com sucesso!');

            // Salvar pedido na API ANTES de limpar o carrinho
            const storedData = sessionStorage.getItem('orderData');
            if (storedData) {
              const orderInfo = JSON.parse(storedData);

              // Preparar dados de pagamento com valores corretos
              const paymentData = {
                captureMethod: capture_method || data.capture_method || 'pix',
                transactionId: transaction_id || '',
                transactionNsu: transaction_nsu || '',
                slug: slug || '',
                orderNsu: order_nsu || '',
                receiptUrl: receipt_url || '',
                paymentCheckUrl: apiUrl,
                paymentSuccess: Boolean(data.success),
                paymentPaid: Boolean(data.paid),
                paymentAmount: data.amount ? Number(data.amount) / 100 : 0,
                paymentPaidAmount: data.paid_amount ? Number(data.paid_amount) / 100 : 0,
                paymentInstallments: data.installments ? Number(data.installments) : 1,
                paymentCaptureMethod: data.capture_method || 'pix'
              };

              console.log('💰 Dados de pagamento preparados:', paymentData);

              await saveOrder(orderInfo, paymentData);

              // Envia e-mail de confirmação
              await sendOrderEmail(orderInfo, receipt_url || '');

              // Limpar carrinho DEPOIS de salvar tudo
              console.log('🛒 Iniciando processo de limpeza do carrinho...');

              // 1. Limpa o localStorage PRIMEIRO
              localStorage.removeItem('xfinder-cart');
              console.log('🗑️ LocalStorage limpo (primeira limpeza)');

              // 2. Depois chama clearCart do contexto
              clearCart();
              console.log('✅ clearCart() chamado');

              // 3. Força uma atualização adicional após um pequeno delay
              setTimeout(() => {
                localStorage.removeItem('xfinder-cart');
                console.log('🔄 Limpeza adicional do localStorage (garantia)');
              }, 100);

              console.log('✅ Processo de limpeza do carrinho concluído');
            }

            // Limpar dados da sessão após 5 minutos
            setTimeout(() => {
              sessionStorage.removeItem('orderData');
              sessionStorage.removeItem('orderProcessed');
              console.log('🗑️ Dados do pedido removidos do sessionStorage');
            }, 300000);
          } else {
            setPaymentStatus('failure');
            console.log('❌ Pagamento não confirmado');
            sessionStorage.removeItem('orderProcessed');
          }
        } catch (error) {
          console.error('❌ Erro ao verificar o pagamento:', error);
          setPaymentStatus('failure');
          sessionStorage.removeItem('orderProcessed');
        }
      };
      checkPayment();
    } else if (isProcessed) {
      console.log('ℹ️ Pedido já foi processado, não processar novamente');
      setPaymentStatus('success');
    } else {
      setPaymentStatus('failure');
    }
  }, [location, clearCart]);

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

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const formatCEP = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const buildOrderEmailHtml = (orderData: any, receiptUrl: string) => {
    const itemsHtml = orderData.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
          <strong>${item.product.name}</strong><br>
          <small>Quantidade: ${item.quantity} x ${formatPrice(item.product.price)}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">
          ${formatPrice(item.product.price * item.quantity)}
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <img src="http://localhost:8080/logo.png" alt="XFinder Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Pedido Confirmado!</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Obrigado por sua compra!</p>
                        </td>
                    </tr>

                    <!-- Dados do Cliente -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                👤 Dados do Cliente
                            </h2>
                            <table width="100%" cellpadding="5" cellspacing="0">
                                <tr>
                                    <td style="color: #666; font-size: 14px;"><strong>Nome:</strong></td>
                                    <td style="color: #333; font-size: 14px;">${orderData.customer.name}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;"><strong>E-mail:</strong></td>
                                    <td style="color: #333; font-size: 14px;">${orderData.customer.email}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;"><strong>Telefone:</strong></td>
                                    <td style="color: #333; font-size: 14px;">${formatPhone(orderData.customer.phone)}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;"><strong>CPF:</strong></td>
                                    <td style="color: #333; font-size: 14px;">${formatCPF(orderData.customer.cpf)}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;"><strong>Data:</strong></td>
                                    <td style="color: #333; font-size: 14px;">${formatDate(orderData.orderDate)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Endereço de Entrega -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                📍 Endereço de Entrega
                            </h2>
                            <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">
                                ${orderData.customer.address}, ${orderData.customer.number}${orderData.customer.complement ? ` - ${orderData.customer.complement}` : ''}<br>
                                ${orderData.customer.neighborhood}<br>
                                ${orderData.customer.city} - ${orderData.customer.state}<br>
                                CEP: ${formatCEP(orderData.customer.cep)}
                            </p>
                        </td>
                    </tr>

                    <!-- Itens do Pedido -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                📦 Itens do Pedido
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px;">
                                ${itemsHtml}
                            </table>
                        </td>
                    </tr>

                    <!-- Resumo Financeiro -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                💳 Resumo do Pagamento
                            </h2>
                            <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                    <td style="color: #666; font-size: 14px;">Subtotal dos Produtos:</td>
                                    <td style="color: #333; font-size: 14px; text-align: right;"><strong>${formatPrice(orderData.total)}</strong></td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;">Frete (${orderData.freight.name}):</td>
                                    <td style="color: #333; font-size: 14px; text-align: right;"><strong>${formatPrice(orderData.freightCost)}</strong></td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px;">Prazo de Entrega:</td>
                                    <td style="color: #333; font-size: 14px; text-align: right;">
                                        <strong>${orderData.freight.delivery_time}${orderData.freight.delivery_time !== "A combinar" ? " dias úteis" : ""}</strong>
                                    </td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="color: #333; font-size: 18px; padding: 15px 8px;"><strong>Total Pago:</strong></td>
                                    <td style="color: #10b981; font-size: 20px; text-align: right; padding: 15px 8px;"><strong>${formatPrice(orderData.totalWithFreight)}</strong></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    ${receiptUrl ? `
                    <!-- Comprovante -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <a href="${receiptUrl}"
                               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                📄 Ver Comprovante de Pagamento
                            </a>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Próximos Passos -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; background-color: #f0f9ff; border-radius: 6px; margin: 0 30px;">
                            <h3 style="color: #1e40af; margin: 20px 0 15px 0; font-size: 16px;">📋 Próximos Passos:</h3>
                            <ul style="color: #1e3a8a; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Você receberá atualizações sobre seu pedido neste e-mail</li>
                                <li>Acompanhe o status através do link do comprovante</li>
                                <li>Em caso de dúvidas, entre em contato pelo WhatsApp</li>
                                <li>Seu pedido será enviado para o endereço informado</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                Este é um e-mail automático de confirmação de pedido.<br>
                                © ${new Date().getFullYear()} XFinder - Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
  };

  const sendOrderEmail = async (orderData: any, receiptUrl: string) => {
    try {
      const htmlContent = buildOrderEmailHtml(orderData, receiptUrl);

      const emailData = {
        nome: orderData.customer.name,
        email: orderData.customer.email,
        assunto: `Confirmação de Pedido - ${formatDate(orderData.orderDate)}`,
        mensagem: `Pedido confirmado com sucesso! Total: ${formatPrice(orderData.totalWithFreight)}`,
        htmlContent: htmlContent
      };

      console.log('📧 Enviando e-mail de confirmação...');

      const response = await fetch('http://localhost:8081/api/mail/html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        console.log('✅ E-mail enviado com sucesso!');
      } else {
        console.error('❌ Erro ao enviar e-mail:', await response.text());
      }
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
    }
  };

  const saveOrder = async (orderData: any, paymentData: any) => {
    try {
      console.log('💾 Salvando pedido na API...');

      // Buscar ID do cliente pelo CPF
      const customerCpf = orderData.customer.cpf.replace(/\D/g, '');
      const customerResponse = await fetch(`http://localhost:8081/api/customers/cpf/${customerCpf}`);

      if (!customerResponse.ok) {
        console.error('❌ Cliente não encontrado');
        return;
      }

      const customer = await customerResponse.json();
      console.log('✅ Cliente encontrado - ID:', customer.id);

      // Preparar dados do frete para observação
      const freightInfo = {
        name: orderData.freight.name,
        company: orderData.freight.company_name,
        price: orderData.freight.price,
        deliveryTime: orderData.freight.delivery_time
      };

      // Preparar itens do pedido
      const items = orderData.items.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity
      }));

      // Criar pedido
      const orderPayload = {
        customerId: customer.id,
        totalAmount: orderData.totalWithFreight,
        freightObservation: JSON.stringify(freightInfo),
        captureMethod: paymentData.captureMethod,
        transactionId: paymentData.transactionId,
        transactionNsu: paymentData.transactionNsu,
        slug: paymentData.slug,
        orderNsu: paymentData.orderNsu,
        receiptUrl: paymentData.receiptUrl,
        paymentCheckUrl: paymentData.paymentCheckUrl,
        paymentSuccess: paymentData.paymentSuccess,
        paymentPaid: paymentData.paymentPaid,
        paymentAmount: paymentData.paymentAmount,
        paymentPaidAmount: paymentData.paymentPaidAmount,
        paymentInstallments: paymentData.paymentInstallments,
        paymentCaptureMethod: paymentData.paymentCaptureMethod,
        orderStatus: 'PAID',
        items: items
      };

      console.log('📤 Payload do pedido:', orderPayload);

      const orderResponse = await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (orderResponse.ok) {
        const savedOrder = await orderResponse.json();
        console.log('✅ Pedido salvo com sucesso! ID:', savedOrder.id);
        console.log('📦 Estoque atualizado automaticamente');
      } else {
        const errorText = await orderResponse.text();
        console.error('❌ Erro ao salvar pedido:', errorText);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar pedido:', error);
    }
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

          {paymentStatus === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-800 mb-2">Compra Realizada com Sucesso!</h2>
                <p className="text-lg text-green-700">Seu pagamento foi confirmado e seu pedido está sendo processado.</p>
              </div>

              {!orderData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800 text-center">
                    ⚠️ Os dados detalhados do pedido não estão disponíveis.
                    Você receberá todas as informações por e-mail.
                  </p>
                  {receiptUrl && (
                    <div className="mt-4 text-center">
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
              )}

              {orderData && (
                <React.Fragment>
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
                        <p className="font-semibold">{formatPhone(orderData.customer.phone)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CPF:</p>
                        <p className="font-semibold">{formatCPF(orderData.customer.cpf)}</p>
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
                      <p>CEP: {formatCEP(orderData.customer.cep)}</p>
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
                </React.Fragment>
              )}
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