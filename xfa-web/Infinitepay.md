[Checkout](https://www.infinitepay.io/checkout)

No Carrinho de Compras, ao clicar no botao finalizar compra deve ser gerado a url de link de pagamento conforme exemplo abaixo
https://checkout.infinitepay.io/fctassinari?items=[{"name":"X-Puller","price":7000,"quantity":1},{"name":"X-Lube","price":7000,"quantity":1}]&redirect_url=https://xfinderarchery.com.br/compra
Note que no array de produtos, o campo price recebe o valor sem a virgula das casas decimais
implemente a execução desta url 

Quando o cliente finalizar a compra, ele será levado para a página definida no redirect_url. Será enviada algumas informações importantes para essa página:
receipt_url - O comprovante de pagamento
transaction_id - Um identificador único da transação
capture_metho - O método de pagamento usado
order_nsu - O número do pedido que você enviou
slug - O identificador único da cobrança

Com os parâmetros fornecidos através da URL de redirecionamento você pode verificar se está tudo certo com as informações do pagamento. Basta fazer uma requisição (GET ou POST) para a url abaixo

https://api.infinitepay.io/invoices/public/checkout/payment_check/{handle}
enviando os seguintes parâmetros:

handle - fctassinari
transaction_nsu - O identificador único da transação
external_order_nsu- -O número do seu pedido
slug - O identificador único da cobrança


O conteúdo da resposta é bem simples, veja exemplo abaixo 

{
   "success": true, // Se houve compra na busca dessa venda
   "paid": true // Se o pagamento foi recebido
}

com esta resposta se tudo for true mostrar a pagina compra com a mensagem de compra realizada com sucesso se for false mostre a mensagem problemas com o pagamento
OK
----------------------------------------------------------------------------------------------------------------------------
2
o arquivo zip anexo é um website de ecomerce de produtos esportivos de tiro com arco, gostaria de o analisasse para implementar alterações
o logo existente no header gostaria que ficasse na mesma posição só que flutuante como o icone do whastapp
na pagina sobre  gostaria que tivesse a mesma formatação da pagina productspage e o bloco {/* Header */} fosse no formado da seção hero
criar uma pagina de contato no mesmo padrao da pagina productspage com o mesmo conteudo de contato da home page
ao clicar no botao visualizar que fica ao lado do botao comprar de cada card de produto, fosse chamada um apagina com id do produto escondido, a imagem do produto, descrição, opção de escolha
com pequenos icone que ao serem clicados alterem a imagem principal e o id do produto e botao comprar igual ao existente no card
ok
----------------------------------------------------------------------------------------------------------------------------
3
Gostaria que a imagem anexa fosse colocada como imagem de fundo no hero section da pagina components\ProductsPage.tsx de forma centralizada,
ou seja que o centro do alvo fique no centro do hero section
