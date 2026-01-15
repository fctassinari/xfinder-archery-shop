# Documento Detalhado: Uso de Cookies e Armazenamento no Frontend

## Sumário
1. [Visão Geral](#visão-geral)
2. [Cookies HTTP](#cookies-http)
3. [LocalStorage](#localstorage)
4. [SessionStorage](#sessionstorage)
5. [Cookies do Keycloak](#cookies-do-keycloak)
6. [Segurança e Privacidade](#segurança-e-privacidade)
7. [Conformidade Legal](#conformidade-legal)
8. [Recomendações](#recomendações)

---

## Visão Geral

Este documento detalha todos os mecanismos de armazenamento utilizados no frontend da aplicação X-Finder Archery Shop, incluindo cookies HTTP, LocalStorage e SessionStorage.

### Tipos de Armazenamento Utilizados

| Tipo | Quantidade | Finalidade |
|------|------------|------------|
| Cookies HTTP | 2 | Funcionalidade do site e autenticação |
| LocalStorage | 1 | Persistência do carrinho de compras |
| SessionStorage | 4 | Dados temporários de sessão |

---

## Cookies HTTP

### 1. Cookie: `sidebar:state`

**Localização no Código:**
- Arquivo: `xfa-web/src/components/ui/sidebar.tsx`
- Linhas: 20-21, 84-85

**Características:**
- **Nome:** `sidebar:state`
- **Valor:** `true` ou `false` (string)
- **Domínio:** Domínio atual do site
- **Caminho:** `/` (raiz do site)
- **Validade:** 7 dias (604.800 segundos)
- **HttpOnly:** Não (acessível via JavaScript)
- **Secure:** Não especificado (herda do protocolo)
- **SameSite:** Não especificado (padrão: Lax)

**Finalidade:**
Armazena o estado de abertura/fechamento da sidebar (menu lateral) para manter a preferência do usuário entre sessões.

**Informações Armazenadas:**
```javascript
// Exemplo de valor armazenado
"true"  // Sidebar aberta
"false" // Sidebar fechada
```

**Impacto na Funcionalidade:**
- **Essencial:** Sim - necessário para manter preferência do usuário
- **Funcional:** Sim - melhora a experiência do usuário
- **Analítico:** Não
- **Marketing:** Não

**Código de Implementação:**
```typescript
const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias

// Ao alterar o estado da sidebar
document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
```

---

### 2. Cookies do Keycloak (Automáticos)

**Localização no Código:**
- Biblioteca: `keycloak-js` (versão 26.0.4)
- Configuração: `xfa-web/src/config/keycloak.ts`

**Características:**
- **Gerenciamento:** Automático pela biblioteca `keycloak-js`
- **Finalidade:** Gerenciamento de sessão SSO (Single Sign-On)
- **Visibilidade:** Não diretamente acessível no código da aplicação

**Cookies Criados pelo Keycloak:**
O Keycloak pode criar os seguintes cookies automaticamente:
- `KEYCLOAK_SESSION` - ID da sessão
- `KEYCLOAK_IDENTITY` - Identidade do usuário
- `KEYCLOAK_SESSION_LEGACY` - Compatibilidade com versões antigas
- `AUTH_SESSION_ID` - ID da sessão de autenticação

**Finalidade:**
Gerenciar a sessão de autenticação do usuário, permitindo Single Sign-On (SSO) e renovação automática de tokens.

**Impacto na Funcionalidade:**
- **Essencial:** Sim - necessário para autenticação
- **Funcional:** Sim - permite login e sessão persistente
- **Analítico:** Não
- **Marketing:** Não

**Observações:**
- Estes cookies são gerenciados automaticamente pela biblioteca Keycloak
- Não são criados diretamente pelo código da aplicação
- Podem variar conforme a configuração do servidor Keycloak

---

## LocalStorage

### 1. Chave: `xfinder-cart`

**Localização no Código:**
- Arquivo: `xfa-web/src/contexts/CartContext.tsx`
- Linhas: 90, 108

**Características:**
- **Chave:** `xfinder-cart`
- **Tipo:** JSON stringificado
- **Persistência:** Permanente (até ser removido manualmente)
- **Escopo:** Domínio atual

**Finalidade:**
Armazenar o carrinho de compras do usuário para persistir entre sessões do navegador.

**Estrutura dos Dados:**
```typescript
interface Cart {
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      // ... outros campos do produto
    };
    quantity: number;
  }>;
  total: number;
  itemCount: number;
}
```

**Exemplo de Dados Armazenados:**
```json
{
  "items": [
    {
      "product": {
        "id": "prod-123",
        "name": "Arco Recurvo",
        "price": 1500.00
      },
      "quantity": 2
    }
  ],
  "total": 3000.00,
  "itemCount": 2
}
```

**Impacto na Funcionalidade:**
- **Essencial:** Sim - necessário para manter carrinho entre sessões
- **Funcional:** Sim - melhora significativamente a experiência do usuário
- **Analítico:** Não
- **Marketing:** Não

**Operações:**
- **Leitura:** Ao inicializar o contexto do carrinho
- **Escrita:** Sempre que o carrinho é modificado
- **Remoção:** Ao finalizar compra ou limpar carrinho

**Código de Implementação:**
```typescript
// Carregar ao inicializar
const savedCart = localStorage.getItem('xfinder-cart');
if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
  dispatch({ type: 'LOAD_CART', payload: parsedCart });
}

// Salvar quando mudar
localStorage.setItem('xfinder-cart', JSON.stringify(cart));
```

---

## SessionStorage

### 1. Chave: `keycloak_auth_state`

**Localização no Código:**
- Arquivos: 
  - `xfa-web/src/contexts/AuthContext.tsx` (linhas 270, 368, 383, 556, 577, 604, 614)
  - `xfa-web/src/services/apiClient.ts` (linhas 66, 79, 94, 169)

**Características:**
- **Chave:** `keycloak_auth_state`
- **Tipo:** JSON stringificado
- **Persistência:** Apenas durante a sessão do navegador
- **Escopo:** Domínio atual

**Finalidade:**
Armazenar temporariamente o estado de autenticação e o token JWT para uso durante a sessão.

**Estrutura dos Dados:**
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
    preferredUsername?: string;
    subject?: string;
    roles?: string[];
  };
  token: string; // JWT token
}
```

**Exemplo de Dados Armazenados:**
```json
{
  "isAuthenticated": true,
  "user": {
    "email": "usuario@example.com",
    "name": "João Silva",
    "preferredUsername": "joao.silva",
    "subject": "abc-123-def-456",
    "roles": ["user", "customer"]
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Informações Sensíveis:**
⚠️ **ATENÇÃO:** Este armazenamento contém o token JWT, que é uma informação sensível. O token contém:
- Identificação do usuário
- Permissões e roles
- Informações de sessão

**Impacto na Funcionalidade:**
- **Essencial:** Sim - necessário para manter autenticação durante navegação
- **Funcional:** Sim - permite requisições autenticadas sem re-login
- **Analítico:** Não
- **Marketing:** Não

**Segurança:**
- Token JWT é sensível e deve ser protegido
- Armazenado apenas durante a sessão (não persiste após fechar navegador)
- Limpo automaticamente ao fazer logout

---

### 2. Chave: `keycloak_customer_synced`

**Localização no Código:**
- Arquivo: `xfa-web/src/contexts/AuthContext.tsx`
- Linhas: 62, 73, 75, 553, 571, 600

**Características:**
- **Chave:** `keycloak_customer_synced`
- **Tipo:** String (`"true"` ou removido)
- **Persistência:** Apenas durante a sessão
- **Escopo:** Domínio atual

**Finalidade:**
Flag booleana para evitar sincronização duplicada do customer entre Keycloak e a base de dados da aplicação.

**Valores Possíveis:**
- `"true"` - Customer já foi sincronizado nesta sessão
- `null` ou ausente - Customer ainda não foi sincronizado

**Impacto na Funcionalidade:**
- **Essencial:** Não - é uma otimização
- **Funcional:** Sim - evita chamadas desnecessárias à API
- **Analítico:** Não
- **Marketing:** Não

---

### 3. Chave: `orderData`

**Localização no Código:**
- Arquivos:
  - `xfa-web/src/components/Cart.tsx` (linhas 562, 706)
  - `xfa-web/src/pages/Compra.tsx` (linhas 23, 77, 131, 224)

**Características:**
- **Chave:** `orderData`
- **Tipo:** JSON stringificado
- **Persistência:** Apenas durante a sessão
- **Escopo:** Domínio atual

**Finalidade:**
Armazenar dados temporários do pedido durante o processo de checkout e pagamento.

**Estrutura dos Dados:**
```typescript
interface OrderData {
  orderId?: number;
  total?: number;
  totalWithFreight?: number;
  freight?: number;
  customerId?: number;
  // ... outros dados do pedido
}
```

**Impacto na Funcionalidade:**
- **Essencial:** Sim - necessário para processar pagamento
- **Funcional:** Sim - permite retomar processo de pagamento
- **Analítico:** Não
- **Marketing:** Não

**Ciclo de Vida:**
1. Criado ao iniciar checkout
2. Atualizado durante processo de pagamento
3. Removido após confirmação de pagamento ou cancelamento

---

### 4. Chave: `orderProcessed`

**Localização no Código:**
- Arquivo: `xfa-web/src/pages/Compra.tsx`
- Linhas: 50, 56, 225, 231, 236

**Características:**
- **Chave:** `orderProcessed`
- **Tipo:** String (`"true"` ou removido)
- **Persistência:** Apenas durante a sessão
- **Escopo:** Domínio atual

**Finalidade:**
Flag booleana para evitar processamento duplicado do pedido, especialmente em caso de refresh da página durante o processo de pagamento.

**Valores Possíveis:**
- `"true"` - Pedido já foi processado
- `null` ou ausente - Pedido ainda não foi processado

**Impacto na Funcionalidade:**
- **Essencial:** Sim - previne processamento duplicado
- **Funcional:** Sim - evita cobranças duplicadas
- **Analítico:** Não
- **Marketing:** Não

---

## Segurança e Privacidade

### Dados Sensíveis Armazenados

#### 1. Token JWT (SessionStorage)
- **Localização:** `keycloak_auth_state.token`
- **Risco:** Alto - contém informações de autenticação
- **Proteção:** 
  - Armazenado apenas em SessionStorage (não persiste)
  - Limpo automaticamente ao fazer logout
  - Não é enviado para domínios externos

#### 2. Dados do Usuário (SessionStorage)
- **Localização:** `keycloak_auth_state.user`
- **Risco:** Médio - informações pessoais
- **Proteção:**
  - Armazenado apenas em SessionStorage
  - Limpo ao fazer logout
  - Não compartilhado com terceiros

#### 3. Dados do Carrinho (LocalStorage)
- **Localização:** `xfinder-cart`
- **Risco:** Baixo - apenas produtos selecionados
- **Proteção:**
  - Dados não sensíveis
  - Apenas produtos e quantidades
  - Não contém informações pessoais

### Medidas de Segurança Implementadas

1. **SessionStorage para Dados Sensíveis**
   - Tokens e dados de autenticação são armazenados apenas em SessionStorage
   - Dados são automaticamente removidos ao fechar o navegador

2. **Limpeza Automática**
   - Dados de autenticação são limpos ao fazer logout
   - Dados de pedido são limpos após processamento

3. **Não Compartilhamento com Terceiros**
   - Dados não são enviados para domínios externos
   - APIs externas (SuperFrete, InfinitePay) não recebem tokens

4. **Validação de Tokens**
   - Tokens são validados antes de uso
   - Renovação automática quando próximo de expirar

---

## Conformidade Legal

### LGPD (Lei Geral de Proteção de Dados)

#### Cookies Essenciais (Não Requerem Consentimento)
- ✅ `sidebar:state` - Funcionalidade essencial do site
- ✅ Cookies do Keycloak - Autenticação essencial

#### Cookies Funcionais (Requerem Consentimento)
- ⚠️ Nenhum cookie funcional não-essencial identificado

#### Cookies Analíticos (Requerem Consentimento)
- ❌ Nenhum cookie analítico identificado

#### Cookies de Marketing (Requerem Consentimento)
- ❌ Nenhum cookie de marketing identificado

### GDPR (General Data Protection Regulation)

**Base Legal para Processamento:**
- **Cookies Essenciais:** Legítimo interesse (funcionamento do site)
- **Autenticação:** Execução de contrato (serviço solicitado pelo usuário)
- **Carrinho:** Legítimo interesse (melhorar experiência do usuário)

**Direitos do Usuário:**
- ✅ Direito de acesso aos dados
- ✅ Direito de retificação
- ✅ Direito de exclusão (logout limpa dados)
- ✅ Direito de portabilidade (dados em formato JSON)

---

## Recomendações

### Segurança

1. **Implementar HttpOnly para Cookies Sensíveis**
   - Considerar mover token JWT para cookie HttpOnly (requer mudanças no backend)
   - Atualmente token está em SessionStorage (mais seguro que cookie não-HttpOnly)

2. **Implementar Secure Flag**
   - Adicionar flag `Secure` aos cookies em produção (HTTPS)
   - Prevenir transmissão em conexões não criptografadas

3. **Implementar SameSite**
   - Adicionar `SameSite=Strict` ou `SameSite=Lax` aos cookies
   - Prevenir ataques CSRF

### Privacidade

1. **Banner de Consentimento**
   - Implementar banner informando uso de cookies
   - Permitir que usuário aceite/recuse cookies não-essenciais
   - Atualmente todos os cookies são essenciais

2. **Política de Cookies**
   - Manter política de cookies atualizada
   - Documentar todos os cookies utilizados
   - Informar finalidade e duração de cada cookie

3. **Transparência**
   - Permitir que usuário visualize cookies armazenados
   - Fornecer ferramenta para gerenciar cookies

### Performance

1. **Otimização de LocalStorage**
   - Considerar compressão para carrinho grande
   - Implementar limite de tamanho

2. **Limpeza Automática**
   - Implementar limpeza automática de dados antigos
   - Remover dados de pedidos processados há mais de X dias

---

## Tabela Resumo

| Tipo | Nome/Chave | Finalidade | Sensível | Persistência | Requer Consentimento |
|------|------------|------------|----------|--------------|---------------------|
| Cookie | `sidebar:state` | Estado da sidebar | Não | 7 dias | Não (essencial) |
| Cookie | Keycloak (auto) | Autenticação SSO | Sim | Sessão | Não (essencial) |
| LocalStorage | `xfinder-cart` | Carrinho de compras | Não | Permanente | Não (essencial) |
| SessionStorage | `keycloak_auth_state` | Estado de autenticação | Sim | Sessão | Não (essencial) |
| SessionStorage | `keycloak_customer_synced` | Flag de sincronização | Não | Sessão | Não (essencial) |
| SessionStorage | `orderData` | Dados temporários do pedido | Não | Sessão | Não (essencial) |
| SessionStorage | `orderProcessed` | Flag de processamento | Não | Sessão | Não (essencial) |

---

## Conclusão

Todos os cookies e mecanismos de armazenamento identificados são **essenciais para o funcionamento do site** e não requerem consentimento explícito segundo LGPD e GDPR, desde que devidamente informados ao usuário.

A aplicação utiliza cookies e armazenamento de forma responsável, priorizando:
- ✅ Funcionalidade essencial
- ✅ Segurança dos dados
- ✅ Privacidade do usuário
- ✅ Transparência

**Recomendação Final:** Implementar banner informativo sobre uso de cookies, mesmo que todos sejam essenciais, para garantir transparência e conformidade legal.

---

**Última Atualização:** Dezembro 2024  
**Versão do Documento:** 1.0  
**Responsável:** Equipe de Desenvolvimento X-Finder Archery Shop
