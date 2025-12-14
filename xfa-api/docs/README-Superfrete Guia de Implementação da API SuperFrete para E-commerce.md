# Guia de Implementação da API SuperFrete para E-commerce

Este guia detalha os passos necessários para integrar a API da SuperFrete ao seu site de e-commerce, permitindo o cálculo de frete, a emissão de etiquetas e o despacho de produtos de forma eficiente.

## 1. Primeiros Passos e Autenticação

Para começar a utilizar a API da SuperFrete, é fundamental configurar a autenticação corretamente. A API exige um token de autenticação que deve ser incluído em todas as requisições. Este token é específico para o ambiente em que você está operando: Sandbox (para testes) ou Produção (para operações reais).

### Geração do Token de Autenticação

O processo de geração do token é idêntico para ambos os ambientes, diferindo apenas na URL de acesso. É crucial obter o token do ambiente correto para evitar problemas de conectividade e funcionalidade.

**Para o Ambiente de Sandbox (Testes):**

O ambiente de Sandbox é um espaço seguro para desenvolver e testar sua integração sem afetar suas operações de produção. Todas as requisições de teste devem ser direcionadas para a URL padrão do Sandbox: `https://sandbox.superfrete.com/`.

1.  Acesse a página de integrações do Sandbox: `https://sandbox.superfrete.com/#/integrations`.
2.  Localize e clique na opção "Integrar em Desenvolvedores".
3.  Confirme a ação clicando em "Confirmar".
4.  O token será gerado e exibido na tela. Copie este token imediatamente, pois ele será necessário para todas as suas requisições no ambiente de Sandbox.

**Para o Ambiente de Produção (Ambiente Real):**

O ambiente de Produção é onde suas operações de frete reais serão processadas. A URL padrão para as requisições em Produção é: `https://api.superfrete.com/`.

1.  Acesse a página de integrações de Produção: `https://web.superfrete.com/#/integrations`.
2.  Clique em "Integrar em Desenvolvedores".
3.  Confirme a ação clicando em "Confirmar".
4.  O token de produção será gerado e exibido. Copie-o cuidadosamente, pois ele é essencial para todas as suas operações de frete em ambiente real.

### Utilização do Token

Uma vez gerado, o token de autenticação deve ser incluído no cabeçalho (header) de todas as suas requisições HTTP. O esquema de autenticação utilizado é o `Bearer`.

**Formato do Cabeçalho de Autorização:**

`Authorization: Bearer {seu_token}`

Substitua `{seu_token}` pelo token que você copiou do ambiente correspondente (Sandbox ou Produção).

### Informações Adicionais no Cabeçalho (User-Agent)

Além do token de autenticação, é obrigatório incluir informações sobre sua aplicação no cabeçalho `User-Agent`. Isso permite que a SuperFrete identifique a origem das requisições e entre em contato, se necessário, para questões técnicas. O formato exigido é:

`User-Agent: Nome da sua aplicação e versão (seu_email@para_contato.com)`

**Exemplo:**

Se sua loja se chama "Minha Loja Online" e a versão da sua integração é 1.0, e seu e-mail de contato é `contato@minhaloja.com`, o cabeçalho `User-Agent` seria:

`User-Agent: MinhaLojaOnline/1.0 (contato@minhaloja.com)`

### Ambiente de Sandbox (Testes)

O ambiente de Sandbox é fundamental para testar a integração da sua plataforma com a API da SuperFrete. É importante ressaltar que as etiquetas geradas neste ambiente não possuem validade real e não podem ser utilizadas para postagem nos Correios ou transportadoras.

Para simular cenários de compra e geração de etiquetas no Sandbox, você precisará adicionar saldo à sua carteira de teste. Este saldo é virtual e serve apenas para fins de simulação.

**Como Adicionar Saldo em Sandbox:**

1.  Acesse a página de créditos do ambiente de Sandbox: `https://sandbox.superfrete.com/#/account/credits`.
2.  Clique na opção "Recarregue com Pix".
3.  Selecione um valor para a recarga virtual. Qualquer valor servirá para simular o pagamento.
4.  Clique em "Recarregar com Pix".
5.  Clique em "Copiar código PIX".
6.  Para simular o pagamento e adicionar o crédito à sua carteira de Sandbox, cole o código PIX copiado diretamente na barra de endereço do seu navegador e pressione Enter. Isso simulará a transação e o saldo será creditado virtualmente.

## 2. Cálculo de Frete Baseado nos Itens do Carrinho

O cálculo de frete é uma etapa crucial para qualquer e-commerce, pois permite apresentar ao cliente o custo de envio antes da finalização da compra. A API da SuperFrete oferece um endpoint específico para isso, que considera o CEP de origem, o CEP de destino e as características dos produtos no carrinho.

### Endpoint para Cálculo de Frete

O endpoint para cotação de frete é `POST /api/v0/calculator`. Você enviará uma requisição JSON contendo todas as informações necessárias para que a API retorne as opções de frete disponíveis e seus respectivos custos.

### Campos Obrigatórios da Requisição

Ao enviar a requisição para o cálculo de frete, os seguintes campos são mandatórios:

*   `from` (string): O Código de Endereçamento Postal (CEP) de origem da encomenda. Pode ser enviado no formato `XXXXX-XXX` (com hífen) ou `XXXXXXXX` (apenas números).
*   `to` (string): O CEP de destino da encomenda, ou seja, o CEP do cliente. Também aceita os formatos `XXXXX-XXX` ou `XXXXXXXX`.
*   `services` (string): Uma lista dos códigos dos serviços de entrega desejados para o cálculo, separados por vírgula. Os códigos válidos são:
    *   `1`: PAC (Correios)
    *   `2`: Sedex (Correios)
    *   `17`: Mini Envios (Correios)
    *   `3`: Jadlog.Package (Jadlog)
    *   `31`: Loggi Econômico (Loggi)

    **Exemplos:**
    *   Para solicitar apenas Sedex: `"2"`
    *   Para solicitar PAC e Sedex: `"1,2"`

    **Observação sobre Loggi:** A inclusão ou exclusão do serviço Loggi no cálculo não depende mais de enviar o código `31` na lista de serviços. A ativação ou desativação da Loggi é configurada diretamente nas configurações do token utilizado para a requisição da API. Se o cliente não desejar usar Loggi, ele deve acessar `https://web.superfrete.com/#/integrations`, clicar em "Configurações do token", desativar Loggi e salvar as alterações.

### Opções Adicionais (`options` objeto)

Você pode incluir um objeto `options` na sua requisição para considerar serviços adicionais no cálculo do frete. Todos os campos dentro de `options` são opcionais:

*   `own_hand` (booleano): Defina como `true` se o serviço de Mão Própria (entrega exclusiva ao destinatário) deve ser considerado.
*   `receipt` (booleano): Defina como `true` se o serviço de Aviso de Recebimento (comprovante de entrega) deve ser considerado.
*   `insurance_value` (float): O valor declarado da encomenda para fins de cálculo de seguro. Este campo deve ser um número decimal.
*   `use_insurance_value` (booleano): Defina como `true` se o seguro (baseado no `insurance_value` fornecido) deve ser incluído no cálculo do frete. Este campo só faz sentido se `insurance_value` também for fornecido.

### Informações sobre os Itens a Serem Enviados

Você deve fornecer as informações sobre os itens a serem enviados de uma das duas maneiras a seguir. É crucial escolher apenas uma delas para cada requisição:

1.  **Envio das Dimensões da Caixa (quando já conhecidas - `package` objeto):**

    Se você já tem as dimensões da embalagem final, pode enviá-las diretamente. Este objeto `package` contém:

    *   `weight` (float): Peso total da caixa em quilogramas (kg).
    *   `height` (float): Altura da caixa em centímetros (cm).
    *   `width` (float): Largura da caixa em centímetros (cm).
    *   `length` (float): Comprimento da caixa em centímetros (cm).

2.  **Envio das Dimensões dos Produtos Individuais (`products` array de objetos):**

    Esta é a abordagem recomendada para e-commerce, pois permite que a API calcule a "caixa ideal" para seus produtos. O array `products` deve conter objetos, cada um representando um item no carrinho:

    *   `quantity` (integer): A quantidade deste produto específico no carrinho (padrão: 1).
    *   `weight` (float): Peso unitário do produto em quilogramas (kg).
    *   `height` (float): Altura unitária do produto em centímetros (cm).
    *   `width` (float): Largura unitária do produto em centímetros (cm).
    *   `length` (float): Comprimento unitário do produto em centímetros (cm).

    **Importante: Cálculo da Caixa Ideal**

    Quando você envia as dimensões dos produtos individuais (`products`), a API da SuperFrete não apenas calcula o frete, mas também retorna as dimensões e o peso da **caixa ideal** para acomodar todos esses itens. É de extrema importância que você utilize essas dimensões e peso da caixa ideal (retornados na resposta da API de cálculo de frete) ao enviar os detalhes da etiqueta através da API de Envio de Frete. Isso garante a precisão no processo de envio e evita discrepâncias com as transportadoras.

    **Exemplo Ilustrativo:**

    Imagine que você calculou o frete para dois produtos, cada um com as seguintes dimensões:

    *   **Produto 1:** Peso: 2kg, Altura: 2cm, Largura: 16cm, Comprimento: 20cm
    *   **Produto 2:** Peso: 2kg, Altura: 2cm, Largura: 16cm, Comprimento: 20cm

    A API de cálculo de frete pode retornar uma "caixa ideal" com as seguintes dimensões:

    *   Peso: 4kg, Altura: 6cm, Largura: 16cm, Comprimento: 24cm

    Ao criar a etiqueta para este pedido, você **deve** usar as dimensões da caixa ideal (4kg, 6cm, 16cm, 24cm) e **não** a soma direta das dimensões dos produtos individuais.

### Exemplo de Requisição (com `products`)

```json
{
    "from": {
        "postal_code": "01153000"
    },
    "to": {
        "postal_code": "20020050"
    },
    "services": "1,2,17",
    "options": {
        "own_hand": false,
        "receipt": false,
        "insurance_value": 0,
        "use_insurance_value": false
    },
    "products": [
        {
            "quantity": 1,
            "height": 4,
            "length": 3,
            "width": 3,
            "weight": 0.03
        }
    ]
}
```

### Dimensões Máximas e Seguro

É fundamental estar ciente das dimensões e pesos máximos permitidos por cada transportadora, bem como os valores máximos de seguro. Exceder esses limites pode resultar em recusa da encomenda ou custos adicionais.

*   **Ponto de Postagem Tipo Franquias (Jadlog, etc.):**
    *   Medidas máximas: 80 cm x 80 cm x 80 cm.
    *   Peso máximo: 120 kg.
    *   Seguro máximo permitido: R$ 1.500,00.

*   **Ponto de Postagem Lojas Parceiras (Jadlog, etc.):**
    *   Medidas máximas: 60 cm x 60 cm x 60 cm.
    *   Peso máximo: 30 kg.
    *   Seguro máximo permitido: R$ 1.500,00.

*   **Loggi:**
    *   Medidas máximas: 100 cm x 100 cm x 100 cm.
    *   A soma dos lados (altura + largura + comprimento) não pode ultrapassar 200 cm.
    *   Peso máximo: 30 kg.
    *   Seguro máximo permitido: R$ 3.000,00.

## 3. Emissão da Etiqueta

Após o cliente selecionar a opção de frete desejada, o próximo passo é emitir a etiqueta de envio. A API da SuperFrete facilita este processo, criando uma etiqueta com status inicial de "aguardando pagamento".

### Endpoint para Envio de Frete

O endpoint para enviar os detalhes do pedido e gerar a etiqueta é `POST /api/v0/cart`. Esta requisição informará à SuperFrete todos os dados necessários para a criação da etiqueta.

### Opções para Pagar e Emitir a Etiqueta

Existem duas maneiras principais de efetuar o pagamento e, consequentemente, emitir a etiqueta:

1.  **Pagamento via Painel SuperFrete:** O lojista pode acessar o painel da SuperFrete e realizar o pagamento da etiqueta utilizando um cartão de crédito ou o saldo disponível em sua conta SuperFrete. Esta é uma opção manual, ideal para validação ou casos específicos.

2.  **Pagamento via API (com Saldo em Conta):** Para uma automação completa, você pode utilizar o endpoint de finalização de pedido (`POST /api/v0/checkout`) para pagar a etiqueta diretamente através da API. Este método desconta o valor do frete do seu saldo pré-pago na SuperFrete, tornando o processo mais ágil e integrado.

### Campos Obrigatórios da Requisição para Emissão da Etiqueta

A requisição para `POST /api/v0/cart` exige um conjunto abrangente de informações para garantir que a etiqueta seja gerada corretamente e contenha todos os dados necessários para o envio.

*   `from` (objeto, obrigatório): Contém todos os dados do remetente (sua loja).
    *   `name` (string, obrigatório): Nome completo do remetente. **Importante:** Se o nome da sua loja tiver apenas uma palavra (ex: "SuperFrete"), adicione "Loja" antes (ex: "Loja SuperFrete") para que a API aceite o nome.
    *   `address` (string, obrigatório): Rua do remetente.
    *   `complement` (string, opcional): Complemento do endereço do remetente.
    *   `number` (string, opcional): Número do endereço do remetente. Se não houver número, envie uma string vazia (`""`).
    *   `district` (string, obrigatório): Bairro do remetente. Se não houver, envie `"NA"`.
    *   `city` (string, obrigatório): Cidade do remetente.
    *   `state_abbr` (string, obrigatório): Sigla do estado do remetente (ex: `SP`). As duas letras devem estar em maiúsculas.
    *   `postal_code` (string, obrigatório): CEP do remetente.
    *   `document` (string, opcional): CPF ou CNPJ do remetente. Se não for enviado, a API utilizará o CPF ou CNPJ vinculado à sua conta SuperFrete para serviços como Loggi e Jadlog.

*   `to` (objeto, obrigatório): Contém todos os dados do destinatário (seu cliente).
    *   `name` (string, obrigatório): Nome completo do destinatário. Deve conter nome e sobrenome.
    *   `address` (string, obrigatório): Rua do destinatário.
    *   `complement` (string, opcional): Complemento do endereço do destinatário.
    *   `number` (string, opcional): Número do endereço do destinatário. Se não houver número, envie uma string vazia (`""`).
    *   `district` (string, obrigatório): Bairro do destinatário. Se não houver, envie `"NA"`.
    *   `city` (string, obrigatório): Cidade do destinatário.
    *   `state_abbr` (string, obrigatório): Sigla do estado do destinatário (ex: `SP`). As duas letras devem estar em maiúsculas.
    *   `postal_code` (string, obrigatório): CEP do destinatário.
    *   `email` (string, opcional): E-mail do destinatário, utilizado para o envio do código de rastreio.
    *   `document` (string, obrigatório para Jadlog e Loggi): CPF ou CNPJ do destinatário. É mandatório para envios via Jadlog e Loggi.

*   `service` (inteiro, obrigatório): O código da modalidade de envio escolhida pelo cliente (ex: `1` para PAC, `2` para SEDEX, `17` para Mini Envios, `3` para Jadlog, `31` para Loggi).

*   `products` (array de objetos, opcional): Utilizado para a criação da declaração de conteúdo. Cada objeto no array representa um produto.
    *   `name` (string): Nome do produto.
    *   `quantity` (inteiro): Quantidade do produto a ser enviado no pacote.
    *   `unitary_value` (float): Valor unitário de cada produto.

    **Importante:** Para envios via Jadlog (serviço `3`) ou Loggi (serviço `31`), a declaração de conteúdo é o único tipo de documento aceito. Para utilizar a declaração de conteúdo, o campo `non_commercial` dentro do objeto `options` (descrito abaixo) deve ser `null` ou `false`.

*   `volume` (objeto, obrigatório): Este é um campo crucial. Ele deve conter as dimensões e o peso do pacote **que foram retornados pela API de cálculo do frete (a "caixa ideal")**.
    *   `height` (float, obrigatório): Altura da caixa em cm.
    *   `width` (float, obrigatório): Largura da caixa em cm.
    *   `length` (float, obrigatório): Comprimento da caixa em cm.
    *   `weight` (float, obrigatório): Peso total da caixa em kg.

    **Lembre-se:** As dimensões aqui devem ser as da embalagem final, calculadas pela API de cotação de frete, e não a soma das dimensões individuais dos produtos.

*   `options` (objeto, opcional): Objeto para especificar serviços opcionais adicionais. Se não for enviado, todos os serviços opcionais serão considerados como `false`.
    *   `insurance_value` (float): Valor da encomenda (sem o frete) para adicionar seguro. Envie `null` se não desejar seguro.
    *   `receipt` (booleano): `true` para receber confirmação de recebimento da encomenda pelo destinatário.
    *   `own_hand` (booleano): `true` para garantir que apenas o destinatário especificado possa receber a encomenda.
    *   `non_commercial` (booleano): Defina como `false` ou não envie o parâmetro se for utilizar nota fiscal no lugar da declaração de conteúdo. Defina como `true` se desejar usar declaração de conteúdo.
    *   `invoice` (objeto): Utilizado para enviar informações da nota fiscal em vez da declaração de conteúdo. **OBS:** Ainda será necessário imprimir e anexar a nota fiscal ao pacote fisicamente.
        *   `number` (string, obrigatório): Número da nota fiscal (44 dígitos).
        *   `key` (string, opcional): Identificador da nota fiscal.

*   `tag` (string, opcional): Uma identificação interna do pedido na sua plataforma.
*   `url` (string, opcional): A URL da sua plataforma.
*   `platform` (string, opcional): O nome da sua plataforma (padrão: "Documentação").

### Status da Etiqueta

Após a criação, a etiqueta pode passar por diferentes status, que indicam o progresso do envio:

*   `pending`: A etiqueta foi criada e está aguardando o pagamento.
*   `released`: A etiqueta foi paga e está aguardando a postagem do produto.
*   `posted`: O produto foi postado na transportadora.
*   `delivered`: O produto foi entregue ao destinatário.
*   `cancelled`: A etiqueta foi cancelada.

### Código de Rastreio

O código de rastreio da etiqueta só é disponibilizado quando a etiqueta atinge o status `released`. Para obter essa informação, você precisará consultar a API de Informações da Etiqueta, passando o ID da etiqueta gerada. O campo `tracking` na resposta conterá o código de rastreio.

## 4. Opções de Embalagem e Despacho do Produto

A documentação da SuperFrete, embora não detalhe explicitamente "opções de embalagem" no sentido de tipos de caixas ou materiais específicos que você deve usar, ela fornece uma diretriz clara sobre como as dimensões da embalagem devem ser tratadas para o cálculo do frete e a emissão da etiqueta. O foco principal está nas **dimensões e peso da embalagem final**.

### Como Lidar com as Dimensões da Embalagem

A principal orientação da SuperFrete é a seguinte:

1.  **Cálculo da Caixa Ideal:** Ao utilizar a API de cálculo de frete (`POST /api/v0/calculator`), você deve enviar as dimensões dos **produtos individuais** que estão no carrinho do seu cliente. Isso é feito através do array `products` na requisição.
2.  **Retorno da API:** A API da SuperFrete, ao processar sua requisição com os produtos individuais, calculará e retornará as dimensões e o peso da **caixa ideal** para acomodar todos esses itens de forma otimizada.
3.  **Uso Consistente:** É **crucial** que você utilize essas dimensões e peso da "caixa ideal" (retornados na resposta da API de cálculo de frete) ao enviar os detalhes da etiqueta através da API de Envio de Frete (`POST /api/v0/cart`). A consistência entre as dimensões usadas no cálculo e na emissão da etiqueta é vital para garantir a precisão do frete e evitar problemas com as transportadoras, como cobranças adicionais ou recusa do pacote.

Em resumo, a "opção de embalagem" que a SuperFrete se preocupa é a que resulta das dimensões otimizadas calculadas por sua API, garantindo que o volume e peso declarados sejam os mais precisos para o envio.

### Despacho do Produto para a Transportadora

O processo de despacho físico do produto para a transportadora é uma etapa que ocorre após a interação com a API da SuperFrete e a emissão da etiqueta. A documentação da API não detalha os procedimentos logísticos específicos de cada transportadora, mas o fluxo geral implica os seguintes passos:

1.  **Geração e Pagamento da Etiqueta:** Conforme detalhado na seção anterior, a etiqueta é gerada via API (`POST /api/v0/cart`) e seu pagamento é efetuado (seja via painel SuperFrete ou via API de finalização de pedido).
2.  **Liberação da Etiqueta:** Após o pagamento ser confirmado, a etiqueta muda seu status para `released` (aguardando postagem). Neste ponto, o código de rastreio já estará disponível.
3.  **Impressão da Etiqueta:** Você deve imprimir a etiqueta gerada pela SuperFrete. Certifique-se de que a impressão esteja clara e legível, com o código de barras escaneável.
4.  **Embalagem do Produto:** O produto deve ser cuidadosamente embalado, utilizando uma caixa que corresponda às dimensões da "caixa ideal" retornada pela API de cálculo de frete. Anexe a etiqueta impressa de forma visível e segura à embalagem.
5.  **Postagem:** Com o produto devidamente embalado e etiquetado, o lojista deve levá-lo ao ponto de postagem da transportadora escolhida (Correios, Jadlog, Loggi, etc.). O local de postagem dependerá do serviço de frete selecionado.

    *   **Para Jadlog:** Pode ser necessário ter um ponto de postagem da Jadlog próximo para que o serviço apareça como opção no cálculo de frete.

### Observações Importantes para o Despacho

*   **Declaração de Conteúdo vs. Nota Fiscal:**
    *   Para envios via Jadlog (serviço `3`) e Loggi (serviço `31`), a **declaração de conteúdo é obrigatória** e o único documento aceito para acompanhar o produto. Certifique-se de que as informações dos produtos (`products` array) sejam enviadas na requisição de emissão da etiqueta para gerar a declaração.
    *   Para outros serviços, você pode optar por usar a nota fiscal. Se usar nota fiscal, o campo `non_commercial` no objeto `options` deve ser `false` ou não ser enviado, e você deve fornecer o número da nota fiscal (`invoice` objeto). Lembre-se que a nota fiscal deve ser impressa e anexada fisicamente ao pacote.

*   **Limites de Dimensões e Peso:** Sempre respeite as dimensões e pesos máximos permitidos por cada transportadora, conforme detalhado na seção de Cálculo de Frete. Exceder esses limites pode levar a problemas no despacho, como recusa do pacote ou cobranças adicionais inesperadas.

Ao seguir estes passos e diretrizes, você poderá integrar a API da SuperFrete de forma eficaz, otimizando o processo de cálculo de frete, emissão de etiquetas e preparação para o despacho em seu e-commerce.



