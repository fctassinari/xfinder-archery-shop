# Teste de Compra
```

https://checkout.infinitepay.io/fctassinari?items=%5B%7B%22name%22%3A%22X-Badge+-+Cavalete%22%2C%22price%22%3A200%2C%22quantity%22%3A1%7D%2C%7B%22name%22%3A%22X-Badge+-+Arqueira%22%2C%22price%22%3A200%2C%22quantity%22%3A1%7D%2C%7B%22name%22%3A%22X-Badge+-+Arco%22%2C%22price%22%3A200%2C%22quantity%22%3A1%7D%5D&redirect_url=http%3A%2F%2Flocalhost%3A8080%2Fcompra&customer_name=Katia+Teresa+Pinheiro+Urano+Gon%C3%A7alves&customer_email=katia.urano%40gmail.com&customer_cellphone=11992022239& address_cep=03311020&address_complement=apto+101&address_number=173


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
        name: "X-Badge - Cavalete",
        price: 2.00,
        image: "https://via.placeholder.com/150"
      },
      quantity: 1
    },
    {
      product: {
        id: 2,
        name: "X-Badge - Arco",
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
  * ✅ Enviar email de confirmação ao cliente atraves de api
  * ✅ Criar tabela para gravar pedido
  * ✅ Gravar o pedido
  * ✅ Limpar carrinho

* Carrinho de compras
  * ✅ Frete que vier zerado nao mostrar nas opções exceto em mãos

* Pagina de Check-out
  * ✅ Formatar e validar CPF
  * ✅ Formatar fone
  * ✅ Formatar cep
  * ✅ Criar tabela de cadastro de cliente
  * ✅ Gravar cadastro/atualizar cadastro
  * ✅ Ao digitar cpf carregar cadastro

* Geral
  * ✅ Cadastrar wraps
  * ✅ Cadastrar pins
  * ✅ Ajustar imagens hero
  * ✅ Ver o que fazer com a newsletter
  * ✅ Implementar Login
  * ✅ SSL
  * ✅ Tirar variaveis do .env e passar para recuperar de api backend
  * ✅ Comentar os console.*
  * ✅ Configurar email no keycloak
  * Permitir fretes somente dos correios
  * ✅ banner de consentimento de cookies
  * aceite email promocional
  * botao de excluir conta


* Implementar Meus pedidos
  * Listar todos os pedidos do cliente

* Implementar tela Administração
  * Buscar pedidos em aberto 
  * Imprimir etiqueta
  
* Implementar Brechó
* Implementar produtos de parceiros

* Implementar regras firewall
  * so aceita do cloudfare

* Implementar
  * rich rules:
    rule family="ipv4" source address="179.118.137.6/32" port port="9090" protocol="tcp" accept
fail2ban 



```  
  The P.R.O.M.P.T
  # P.ersona - Eu sou um engenheiro de software
  # R.oteiro - Gostaria de um exemplo de autenticação (dos usuários) para um aplicativo em Python com o office365.
  # O.bjetivo - que meus usuários entrem no aplicativo que estou desenvolvendo em streamlit usando suas contas do office365.
  # M.odelo - Algo como um botão de login social.
  # P.anorama -  gostaria de manter um "cadastro local, após autenticação devo registrar o Nome e Sobrenome do usuário em meu aplicativo e ainda associar as minhas permições de RBAC existentes" 
  # T.ransformar - se possível informar também os módulos de python em uma arquivo de requisitos para facilitar a implementação da funcionalidade.
    
  Sou um engenheiro de software
  Gostaria de implementar um controle de autenticação com o Keycloak 26.4 para garantir que o cliente que está comprando é realmente a pessoa cadastrada
  o cliente deve ter a possibilidade de criar sua conta e/ou recuperar a senha no keycloak
```