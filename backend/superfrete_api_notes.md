# Guia de Implementação da API Superfrete
[SuperFrete](https://web.superfrete.com/)

[Doc](https://superfrete.readme.io/reference/primeiros-passos)




curl --request POST -v --url https://sandbox.superfrete.com/api/v0/calculator --header 'Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTgxMzIwMzUsInN1YiI6IktsQnlIY0ZhRWJSZWE5anJyS1lxM25KQWV4SjMifQ.jdNXV3ab5USutPy35Kob4z99jl_Iqvhec6Y2gM0W4xY}' --header 'User-Agent: XFinder (contato.xfinder@gmail.com.br)' --header 'accept: application/json' --header 'content-type: application/json'
                                                                                                               eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTgxMzIwMzUsInN1YiI6IktsQnlIY0ZhRWJSZWE5anJyS1lxM25KQWV4SjMifQ.jdNXV3ab5USutPy35Kob4z99jl_Iqvhec6Y2gM0W4xY

curl --request POST --url https://sandbox.superfrete.com/api/v0/calculator --header 'Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTc4NjczNTcsInN1YiI6IktsQnlIY0ZhRWJSZWE5anJyS1lxM25KQWV4SjMifQ.Jky9cvTKy0bU6xdn7sMh_hVgFf7mVJCQx06XMjONtMs}' --header 'User-Agent: Superfrete (integracao@superfrete.com)' --header 'accept: application/json' --header 'content-type: application/json'


curl --request POST -v --url https://web.superfrete.com/api/v0/calculator --header 'Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTc4NjQyNjQsInN1YiI6IklQNkhyUURzQXJVUjJVY29vOUpRZFdYU1B0NjMifQ.1Ej63bA6fKx7yMJLZbD9s4EO6n4dMCTsalryi8h3QOU}' --header 'User-Agent: XFinder (contato.xfinder@gmail.com.br)' --header 'accept: application/json' --header 'content-type: application/json'

## 1. Autenticação

Para interagir com a API Superfrete, é necessário um token de autenticação específico para o ambiente (Sandbox para testes ou Produção para ambiente real).

### Geração de Token:

O processo é o mesmo para ambos os ambientes, mudando apenas o link de acesso:

**Ambiente de Sandbox (testes):**
1. Acesse: `https://sandbox.superfrete.com/#/integrations`
2. Clique em "Integrar em Desenvolvedores".
3. Clique em "Confirmar".
4. O token será gerado e exibido na tela. Copie-o para usar em suas requisições no ambiente de Sandbox.
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTk0MDMyNjYsInN1YiI6IktsQnlIY0ZhRWJSZWE5anJyS1lxM25KQWV4SjMifQ.x4pHsm3Z6-kP4TLcej8p2pC_OxW50cKDfDtl006cRmg
   ```

**Ambiente de Produção (ambiente real):**
1. Acesse: `https://web.superfrete.com/#/integrations`
2. Clique em "Integrar em Desenvolvedores".
3. Clique em "Confirmar".
4. O token será gerado e exibido na tela. Copie-o para usar em suas requisições no ambiente de Produção.
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTc4NjQyNjQsInN1YiI6IklQNkhyUURzQXJVUjJVY29vOUpRZFdYU1B0NjMifQ.1Ej63bA6fKx7yMJLZbD9s4EO6n4dMCTsalryi8h3QOU
   ``` 
### Utilização do Token:

Inclua o token gerado no header da sua requisição HTTP utilizando o esquema de autenticação `Bearer`. O nome do header é `Authorization`.

**Exemplo:**
`Authorization: Bearer {seu_token}`

### Informações Adicionais no Header:

É obrigatório incluir informações sobre sua aplicação para contato técnico no header `User-Agent`, no seguinte formato:

`User-Agent: Nome da sua aplicação e versão (seu_email@para_contato.com)`

**Exemplo:**
`User-Agent: MinhaLojaOnline (contato@minhaloja.com)`

## 2. Ambiente de Sandbox (Teste)

O ambiente de Sandbox é ideal para testar a integração. As requisições de teste na documentação utilizam a URL de Sandbox (`https://sandbox.superfrete.com/`).

**Importante:** Etiquetas geradas em Sandbox não são válidas para postagem real.

### Adicionar Saldo em Sandbox:

Para simular cenários de compra e geração de etiquetas no Sandbox, adicione saldo à sua carteira de teste:
1. Acesse o ambiente de Sandbox: `https://sandbox.superfrete.com/#/account/credits`
2. Clique em "Recarregue com Pix".
3. Selecione um valor para recarga.
4. Clique em "Recarregar com Pix".
5. Clique em "Copiar código PIX".
6. Cole o código PIX copiado na **barra de endereço do seu navegador e pressione Enter**. Isso simulará o pagamento e o crédito será adicionado à sua carteira de Sandbox.





## 3. Cálculo de Frete (Cotação de Frete)

Este endpoint (`POST /api/v0/calculator`) calcula o valor do frete com base no CEP de origem, CEP de destino e nas características dos produtos ou pacotes.

### Campos da Requisição (JSON):

**Obrigatórios:**

*   `from` (string): CEP de origem (formato XXXXX-XXX ou XXXXXXXX).
*   `to` (string): CEP de destino (formato XXXXX-XXX ou XXXXXXXX).
*   `services` (string): Códigos dos serviços de entrega desejados (separados por vírgula):
    *   `1`: PAC
    *   `2`: Sedex
    *   `17`: Mini Envios
    *   `3`: Jadlog.Package
    *   `31`: Loggi Econômico (ativar/desativar nas configurações do token)

**Opcionais (`options` objeto):**

*   `own_hand` (booleano): `true` para Mão Própria.
*   `receipt` (booleano): `true` para Aviso de Recebimento.
*   `insurance_value` (float): Valor declarado para seguro.
*   `use_insurance_value` (booleano): `true` para incluir seguro (se `insurance_value` for fornecido).

### Informações sobre os Itens (uma das duas opções):

1.  **Envio das Dimensões da Caixa (`package` objeto):**
    *   `weight` (float): Peso total da caixa em kg.
    *   `height` (float): Altura da caixa em cm.
    *   `width` (float): Largura da caixa em cm.
    *   `length` (float): Comprimento da caixa em cm.

2.  **Envio das Dimensões dos Produtos Individuais (`products` array de objetos):**
    *   `quantity` (integer): Quantidade do produto (padrão: 1).
    *   `weight` (float): Peso do produto em kg.
    *   `height` (float): Altura do produto em cm.
    *   `width` (float): Largura do produto em cm.
    *   `length` (float): Comprimento do produto em cm.

**Importante:** Se você enviar as dimensões dos produtos individuais, a API retornará as dimensões e o peso da **caixa ideal**. É crucial usar essas dimensões da caixa ideal ao enviar os detalhes da etiqueta para a SuperFrete.

### Dimensões Máximas (Exemplos):

*   **Ponto de postagem tipo franquias:** 80x80x80 cm, 120 kg. Seguro máximo R$ 1.500,00.
*   **Ponto de postagem lojas Parceiras:** 60x60x60 cm, 30 kg. Seguro máximo R$ 1.500,00.
*   **Loggi:** 100x100x100 cm (soma dos lados <= 200cm), 30 kg. Seguro máximo R$ 3.000,00.





## 4. Emissão de Etiquetas (Enviar Frete para a SuperFrete)

Este endpoint (`POST /api/v0/cart`) permite enviar os detalhes de um pedido para a SuperFrete e gerar uma etiqueta de frete com status "aguardando pagamento" (pending).

### Opções para Emitir a Etiqueta:

1.  **Pagamento via Painel SuperFrete:** Realizado diretamente no painel da SuperFrete (cartão de crédito ou saldo em conta).
2.  **Pagamento via API:** Utilize o endpoint de finalização de pedido para pagar a etiqueta diretamente através da API, descontando do seu saldo na SuperFrete.

### Campos da Requisição (JSON):

*   `from` (obrigatório): Dados do remetente (nome, endereço, complemento, número, bairro, cidade, estado, CEP, documento).
    *   **Importante:** O nome do remetente deve ter nome e sobrenome. Se o nome da loja tiver apenas um nome (ex: SuperFrete), adicione "Loja" antes (ex: Loja SuperFrete).
*   `to` (obrigatório): Dados do destinatário (nome, endereço, complemento, número, bairro, cidade, estado, CEP, email, documento).
    *   **Importante:** O documento (CPF ou CNPJ) do destinatário é obrigatório para Jadlog e Loggi.
*   `service` (obrigatório): Modalidade de envio (1: PAC, 2: SEDEX, 17: Mini Envios, 3: Jadlog, 31: Loggi).
*   `products` (opcional): Produtos para a declaração de conteúdo (nome, quantidade, valor unitário).
    *   **Importante:** Para Jadlog ou Loggi, apenas declaração de conteúdo é aceita (campo `non_commercial` como nulo ou falso).
*   `volume` (obrigatório): Dimensões e peso do pacote, **retornados pela API de cálculo do frete (caixa ideal)**.
    *   `height` (altura), `width` (largura), `length` (comprimento), `weight` (peso).
*   `options` (opcional): Serviços opcionais (insurance_value, receipt, own_hand, non_commercial, invoice).
    *   `non_commercial`: `FALSE` ou não enviar para usar nota fiscal. `TRUE` para declaração de conteúdo.
    *   `invoice`: Para nota fiscal, inclua `number` (44 dígitos) e opcionalmente `key`.
*   `tag`: Identificação do pedido na plataforma.
*   `url`: URL da plataforma.
*   `platform`: Nome da plataforma.

### Status da Etiqueta:

*   `pending`: Aguardando pagamento.
*   `released`: Aguardando postagem.
*   `posted`: Postado.
*   `delivered`: Entregue.
*   `cancelled`: Cancelado.

### Código de Rastreio:

Disponível apenas quando a etiqueta está no status `released`. Para obter, use a API de Informações da Etiqueta (`tracking`).





## 5. Opções de Embalagem e Despacho de Produtos

A documentação da SuperFrete não detalha explicitamente "opções de embalagem" no sentido de tipos de caixas ou materiais. Em vez disso, ela foca nas **dimensões e peso da embalagem final**.

**A principal orientação é:**

*   Utilize a API de cálculo de frete (`POST /api/v0/calculator`) enviando as dimensões dos **produtos individuais** (`products`).
*   A API retornará as dimensões e o peso da **caixa ideal** para acomodar esses produtos.
*   **É crucial utilizar essas dimensões da caixa ideal** ao enviar os detalhes da etiqueta através da API de Envio de Frete para a SuperFrete (`POST /api/v0/cart`). Isso garante a precisão no processo de envio e evita problemas com a transportadora.

### Despacho do Produto para a Transportadora:

O processo de despacho em si não é detalhado na documentação da API, pois é uma etapa física que ocorre após a emissão da etiqueta. No entanto, a documentação implica o seguinte:

1.  **Geração da Etiqueta:** Após enviar os detalhes do pedido para a API de Envio de Frete, uma etiqueta será gerada com status "pending" (aguardando pagamento).
2.  **Pagamento da Etiqueta:** O pagamento pode ser feito via painel SuperFrete ou via API (se houver saldo em conta).
3.  **Liberação da Etiqueta:** Após o pagamento, a etiqueta terá o status "released" (aguardando postagem) e o código de rastreio estará disponível.
4.  **Postagem:** Com a etiqueta impressa e o produto embalado (com as dimensões da caixa ideal), o lojista deve postar o produto na transportadora escolhida (Correios, Jadlog, Loggi, etc.), conforme o serviço selecionado.

**Observações Importantes:**

*   **Declaração de Conteúdo/Nota Fiscal:** Para Jadlog e Loggi, a declaração de conteúdo é obrigatória. Para outros serviços, pode-se usar nota fiscal (informando o número na API).
*   **Dimensões Máximas:** Fique atento às dimensões e pesos máximos permitidos por cada transportadora (mencionado na seção de Cálculo de Frete).



