# Teste de Compra
```
http://localhost:8080/compra?capture_method=pix&transaction_id=553ef064-8d27-4795-a47f-95b525c0b6d1&transaction_nsu=553ef064-8d27-4795-a47f-95b525c0b6d1&slug=e9TfXtJH&order_nsu=14b1545e-9008-443a-a6fd-a14c2f4d5ed4&receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F553ef064-8d27-4795-a47f-95b525c0b6d1



http://localhost:8080/compra?
capture_method=pix&
transaction_id=553ef064-8d27-4795-a47f-95b525c0b6d1&
transaction_nsu=553ef064-8d27-4795-a47f-95b525c0b6d1&
slug=e9TfXtJH&
order_nsu=14b1545e-9008-443a-a6fd-a14c2f4d5ed4&
receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F553ef064-8d27-4795-a47f-95b525c0b6d1

https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=553ef064-8d27-4795-a47f-95b525c0b6d1&external_order_nsu=14b1545e-9008-443a-a6fd-a14c2f4d5ed4&slug=e9TfXtJH

{"success":true,"paid":true,"amount":400,"paid_amount":400,"installments":1,"capture_method":"pix"}
```
Chamar a url abaixo:

http://localhost:8080/compra?capture_method=pix&transaction_id=553ef064-8d27-4795-a47f-95b525c0b6d1&transaction_nsu=553ef064-8d27-4795-a47f-95b525c0b6d1&slug=e9TfXtJH&order_nsu=14b1545e-9008-443a-a6fd-a14c2f4d5ed4&receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F553ef064-8d27-4795-a47f-95b525c0b6d1


Para simular dados no sessionStorage e testar a página, adicione este código temporário no console do navegador quando estiver na página de compra:
```
// Cole isso no console do navegador para simular dados de pedido
sessionStorage.setItem('orderData', JSON.stringify({
  customer: {
    name: "Katia Teresa Pinheiro Urano Gonçalves",
    email: "katia.urano@gmail.com",
    phone: "11992022239",
    cpf: "12345678900",
    cep: "03311020",
    address: "Rua Exemplo",
    number: "173",
    complement: "apto 101",
    neighborhood: "Tatuapé",
    city: "São Paulo",
    state: "SP"
  },
  items: [
    {
      product: {
        id: 1,
        name: "X-Tap - Cavalete",
        price: 2.00,
        image: "https://via.placeholder.com/150"
      },
      quantity: 1
    },
    {
      product: {
        id: 2,
        name: "X-Tap - Arco",
        price: 2.00,
        image: "https://via.placeholder.com/150"
      },
      quantity: 1
    }
  ],
  freight: {
    name: "PAC",
    company_name: "Correios",
    price: 15.50,
    delivery_time: "10"
  },
  total: 4.00,
  freightCost: 15.50,
  totalWithFreight: 19.50,
  orderDate: new Date().toISOString()
}));

// Depois recarregue a página
location.reload();
```

---
# TODO
* Pagina de compras 
  * ✅ Formatar CPF
  * ✅ Formatar fone
  * ✅ Formatar cep
  * Enviar email de confirmação ao cliente atraves de api
  * Criar tabela para gravar pedido
  * Gravar o pedido
  * ✅ Limpar carrinho

* Carrinho de compras
  * ✅ Frete que vier zerado nao mostrar nas opções exceto em mãos

* Pagina de Check-out
  * ✅ Formatar e validar CPF
  * ✅ Formatar fone
  * ✅ Formatar cep
  * Criar tabela de cadastro de cliente
  * Gravar cadastro/atualizar cadastro
  * Ao digitar cpf carregar cadastro


🎯 Fluxo completo:

Cliente finaliza compra ✅<br>
InfinitePay redireciona para página de confirmação ✅<br>
Verifica pagamento (MOCK em dev) ✅<br>
Se pago com sucesso:<br>
<br>
Exibe mensagem de sucesso ✅<br>
Mostra todos os dados do pedido ✅<br>
Limpa o carrinho ✅<br>
Agenda limpeza do sessionStorage ✅<br>

