import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Compra = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transaction_id = params.get('transaction_id');
    const order_nsu = params.get('order_nsu');
    const slug = params.get('slug');

    if (transaction_id && order_nsu && slug) {
      const checkPayment = async () => {
        try {
          const response = await fetch(`https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=${transaction_id}&external_order_nsu=${order_nsu}&slug=${slug}`);
          const data = await response.json();

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
  );
};

export default Compra;


