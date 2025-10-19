import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import heroImage from "@/assets/nocks.jpeg";





const Compra = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');

  useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const transaction_id = params.get('transaction_id');
//     const transaction_nsu = params.get('transaction_nsu');
//     const order_nsu = params.get('order_nsu');
//     const slug = params.get('slug');


    const params = new URLSearchParams(location.search);
    const transaction_id = '4a4b0955-f786-471a-9cd2-348f90bf861f';
    const transaction_nsu = '4a4b0955-f786-471a-9cd2-348f90bf861f&slug=6UkxZ23vCb';
    const order_nsu = '5c7f02e8-f18b-47ea-aa57-508fbbf5413a';
    const slug = '6UkxZ23vCb';

      console.log('Parâmetros recebidos:', {
        transaction_id,
        transaction_nsu,
        order_nsu,
        slug
      });

    if (transaction_nsu  && order_nsu && slug) {
      const checkPayment = async () => {
        try {
//           const response = await fetch(`https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=${transaction_nsu}&external_order_nsu=${order_nsu}&slug=${slug}`);
//            const data = await response.json();
          const data = JSON.parse('{"success":true,"paid":true,"amount":200,"paid_amount":200,"installments":1,"capture_method":"pix"}');
// console.log('data=',data.success);
// console.log('data=',data.paid);
          if (data.success && data.paid) {
            setPaymentStatus('success');
          } else {
            setPaymentStatus('failure');
          }
        } catch (error) {
          console.error('Erro ao verificar o pagamento:', error);
          setPaymentStatus('failure');
        }
      };
      checkPayment();
    } else {
      setPaymentStatus('failure'); // Parâmetros insuficientes
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
              {/* Hero Section */}
              <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
              {/*<section className="relative py-20 bg-gradient-to-r from-navy-primary to-navy-primary/80 text-white">*/}
                <div className="container mx-auto px-4">
                  <div className="text-center animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                      Entre em Contato
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                      Nossa equipe de especialistas está pronta para ajudar você a encontrar
                      o equipamento perfeito para suas necessidades.
                    </p>
                  </div>
                </div>
              </section>

                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                  {paymentStatus === 'pending' && (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800">Verificando status do pagamento...</h2>
                      <p className="text-gray-600 mt-2">Por favor, aguarde.</p>
                    </div>
                  )}
                  {paymentStatus === 'success' && (
                    <div className="text-center text-green-600">
                      <h2 className="text-3xl font-bold">Compra Realizada com Sucesso!</h2>
                      <p className="text-lg mt-4">Seu pagamento foi confirmado.</p>
                    </div>
                  )}
                  {paymentStatus === 'failure' && (
                    <div className="text-center text-red-600">
                      <h2 className="text-3xl font-bold">Problemas com o Pagamento</h2>
                      <p className="text-lg mt-4">Não foi possível confirmar seu pagamento. Por favor, tente novamente ou entre em contato.</p>
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


