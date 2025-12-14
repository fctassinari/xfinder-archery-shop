# Guia de Configuração do Keycloak para X-Finder Archery Shop

Este guia fornece instruções passo a passo para configurar o Keycloak com autenticação OAuth2/OIDC usando Authorization Code Flow com PKCE.

## Pré-requisitos

- Keycloak rodando em `https://localhost:8443`
- Acesso ao Keycloak Admin Console
- Credenciais de administrador do Keycloak

## Passo 1: Acessar o Keycloak Admin Console

1. Abra seu navegador e acesse: `https://localhost:8443`
2. Clique em **Administration Console**
3. Faça login com as credenciais de administrador:
    - **Username**: `admin`
    - **Password**: `XFA@2025` (ou a senha configurada no seu ambiente)

## Passo 2: Criar o Realm

1. No menu superior esquerdo, você verá um dropdown com o texto **master**
2. Clique no dropdown e selecione **Create Realm**
3. Preencha o formulário:
    - **Realm name**: `xfinder`
    - Clique em **Create**

## Passo 3: Criar o Client (Aplicação)

1. No menu lateral esquerdo, clique em **Clients**
2. Clique no botão **Create client** (canto superior direito)
3. Na página **Add client**, preencha:
    - **Client type**: Selecione **OpenID Connect**
    - Clique em **Next**
4. Na página **Login settings**, configure:
    - **Client ID**: `xfinder-web`
    - **Name**: `X-Finder Web Application` (opcional, mas recomendado)
    - **Description**: `Frontend React application for X-Finder Archery Shop` (opcional)
    - Clique em **Next**
    - **Client authentication**: **OFF** (para client público)
    - **Authentication flow**: Marque **Standard flow** e **Direct access grants**
    - Clique em **Next**
    - **Root URL**: `http://localhost:8080`
    - **Home URL**: `http://localhost:8080`
    - **Valid redirect URIs**:
      ```
      http://localhost:8080/*
      https://localhost:8080/*
      ```
    - **Valid post logout redirect URIs**:
      ```
      http://localhost:8080/*
      https://localhost:8080/*
      ```
    - **Web origins**:
      ```
      http://localhost:8080
      https://localhost:8080
      *
      ```
    - Clique em **Save**

5. Na página **Capability config**, configure:
    - **Client authentication**: **OFF** (já configurado)
    - **Authorization**: **OFF** (não necessário para este caso)
    - **Standard flow**: **ON** ✅
    - **Direct access grants**: **ON** ✅ (útil para desenvolvimento)
    - **Implicit flow**: **OFF** ❌
    - **OAuth 2.0 Device Authorization Grant**: **OFF** (opcional)

6. Na página **Login settings**, revise as configurações e clique em **Save**

## Passo 4: Habilitar PKCE (Proof Key for Code Exchange)

O PKCE é essencial para segurança em aplicações Single Page Applications (SPA). Siga estes passos detalhados:

### 4.1: Acessar as Configurações do Client

1. Clique na aba **Settings**
2. Descendo a tela encontre **Capability config**
3. No campo **PKCE Method**
4. Este campo pode aparecer como um dropdown/select
5. As opções disponíveis são:
    - **S256** (recomendado) - Usa SHA-256 para hash do code challenge (mais seguro)
    - **plain** - Usa o code challenge em texto plano (menos seguro, apenas para desenvolvimento/teste)
6. **Selecione: `S256`** ✅
7. Clique no botão **Save**

### 4.2: Verificar Outras Configurações Relacionadas

Na seção **Advanced settings**, verifique também:

- **Access token signature algorithm**: Pode ser `RS256` (padrão, recomendado)
- Clique no botão **Save**

### 4.3: Alternativa - Habilitar PKCE via Client Scopes (Método Alternativo)

Se não encontrar o campo na seção Advanced settings, você pode habilitar via Client Scopes:

1. Vá para **Clients** → `xfinder-web` → aba **Client scopes**
2. Clique em **xfinder-web-dedicated** (ou o scope dedicado do client)
3. Na aba **Settings** do scope, procure por configurações de PKCE
4. Ou crie um novo mapper se necessário

**Nota**: O método descrito acima (Passo 4.1) é o método padrão e mais direto.

## Passo 5: Configurar Roles

1. No menu lateral esquerdo, clique em **Realm roles**
2. Clique em **Create role**
3. Crie as seguintes roles:

   **Role: customer**
    - **Role name**: `customer`
    - **Description**: `Cliente padrão do e-commerce`
    - Clique em **Create**

   **Role: admin**
    - **Role name**: `admin`
    - **Description**: `Administrador do sistema`
    - Clique em **Create**

   **Role: seller** (opcional)
    - **Role name**: `seller`
    - **Description**: `Vendedor`
    - Clique em **Create**

## Passo 6: Configurar Role Default para Novos Usuários

1. No menu lateral esquerdo, clique em **Realm settings**
2. Clique na aba **User registration**
3. Role até a seção **Default roles**
4. Clique em **Assign role**
5. Clique em **Realm roles**
6. Selecione a role **customer**
6. Clique em **Assign**

## Passo 7: Configurar Mappers (Opcional, mas Recomendado)

Os mappers garantem que informações importantes estejam disponíveis no token JWT.

[//]: # (### 7.1: Mapper para Email)

[//]: # ()
[//]: # (1. Volte para **Clients** no menu lateral)

[//]: # (2. Clique no client `xfinder-web`)

[//]: # (3. Clique na aba **Client scopes**)

[//]: # (4. Clique em **xfinder-web-dedicated** &#40;ou crie um novo scope&#41;)

[//]: # (5. Clique na aba **Mappers**)

[//]: # (6. Clique em **Add predefined mapper**)

[//]: # (7. Selecione **email**)

[//]: # (8. Clique em **Add**)

### 7.2: Mapper para Realm Roles (CRÍTICO - Configuração Corrigida!)

**⚠️ IMPORTANTE**: Baseado no projeto angular-quarkus que funciona, o mapper deve adicionar roles no claim `roles` (não aninhado), não em `realm_access.roles`!

**OPÇÃO RECOMENDADA (que funciona com Quarkus):**

1. Na mesma página de **Mappers** do `xfinder-web-dedicated`
2. Clique em **Add mapper** → **By configuration**
3. Selecione **User Realm Role**
4. Configure:
     - **Name**: `roles` (ou `realm-roles`)
     - **Token Claim Name**: `roles` ⚠️ **IMPORTANTE: Use `roles` (simples), NÃO `realm_access.roles`!**
     - **Claim JSON Type**: `String` (ou `JSON` - ambos funcionam)
     - **Multivalued**: **ON** ✅ (importante para lista de roles)
     - **Add to ID token**: **ON** ✅ (opcional, mas recomendado)
     - **Add to access token**: **ON** ✅ (CRÍTICO - deve estar marcado!)
     - **Add to userinfo**: **ON** ✅ (deve estar marcado)
5. Clique em **Save**

**OPÇÃO ALTERNATIVA (se a primeira não funcionar):**

Se você já tem o mapper "Realm role" pré-definido:
1. Clique no mapper "Realm role" para editá-lo
2. Configure:
     - **Token Claim Name**: `roles` (mude de `realm_access.roles` para `roles`)
     - **Add to access token**: **ON** ✅
     - **Add to ID token**: **ON** ✅
     - **Add to userinfo**: **ON** ✅
3. Clique em **Save**

**Verificação**: Após salvar, faça logout e login novamente no frontend. O token deve ter um claim `roles` (não aninhado) contendo a lista de roles, incluindo `customer`.

**Por que isso funciona?**
- O Quarkus tem problemas para extrair roles de caminhos aninhados como `realm_access.roles`
- Usar o claim simples `roles` é mais confiável e é a abordagem recomendada

### 7.3: Mapper para Full Name

1. Na mesma página de **Mappers**
2. Clique em **Add predefined mapper**
3. Selecione **Full name**
4. Clique em **Add**

6. Clique em **Add mapper** → **By configuration**
7. Selecione **User Attribute**
8. Configure:
   - **Name**: `email`
   - **User Attribute**: `email`
   - **Token Claim Name**: `email`
   - **Claim JSON Type**: `String`
   - **Add to ID token**: **ON** ✅
   - **Add to access token**: **ON** ✅
   - **Add to userinfo**: **ON** ✅
   - Clique em **Save**

[//]: # (### 7.2: Mapper para Roles)

[//]: # ()
[//]: # (1. Na mesma página de Mappers, clique em **Add mapper** → **By configuration**)

[//]: # (2. Selecione **Realm roles**)

[//]: # (3. Configure:)

[//]: # (   - **Name**: `realm roles`)

[//]: # (   - **Token Claim Name**: `realm_access.roles`)

[//]: # (   - **Claim JSON Type**: `String`)

[//]: # (   - **Multivalued**: **ON** ✅)

[//]: # (   - **Add to ID token**: **ON** ✅)

[//]: # (   - **Add to access token**: **ON** ✅)

[//]: # (   - **Add to userinfo**: **ON** ✅)

[//]: # (   - Clique em **Save**)
[//]: # (### 7.3: Mapper para Nome)

[//]: # ()
[//]: # (1. Clique em **Add mapper** → **By configuration**)

[//]: # (2. Selecione **User Attribute**)

[//]: # (3. Configure:)

[//]: # (   - **Name**: `name`)

[//]: # (   - **User Attribute**: `firstName` e `lastName` &#40;ou use `name` se disponível&#41;)

[//]: # (   - **Token Claim Name**: `name`)

[//]: # (   - **Claim JSON Type**: `String`)

[//]: # (   - **Add to ID token**: **ON** ✅)

[//]: # (   - **Add to access token**: **ON** ✅)

[//]: # (   - **Add to userinfo**: **ON** ✅)

[//]: # (   - Clique em **Save**)

## Passo 8: Configurar Token Expiration (Opcional)

1. No menu lateral, clique em **Realm settings**
2. Clique na aba **Tokens**
3. Configure os tempos de expiração (recomendado):
    - **Access Token Lifespan**: `5 Minutes` (para produção, pode ser menor)
    - **Access Token Lifespan For Implicit Flow**: `15 Minutes`
    - **Client Login Timeout**: `1 Minute`
4. Clique em **Save**
5. Clique na aba **Sessions**
    - **SSO Session Idle**: `30 Minutes`
    - **SSO Session Max**: `10 Hours`
6. Clique em **Save**

## Passo 9: Testar a Configuração

### 9.1: Criar um Usuário de Teste

1. No menu lateral, clique em **Users**
2. Clique em **Create new user**
3. Preencha:
    - **Username**: `teste@xfinder.com`
    - **Email**: `teste@xfinder.com`
    - **First name**: `Teste`
    - **Last name**: `Usuario`
    - **Email verified**: **ON** ✅
    - Clique em **Create**

4. Na aba **Credentials**, clique em **Set password**
5. Preencha:
    - **Password**: (defina uma senha)
    - **Temporary**: **OFF** ❌
    - Clique em **Save**

6. Na aba **Role mapping**, clique em **Assign role**
7. Selecione a role **customer**
8. Clique em **Assign**

### 9.2: Verificar Configuração do Client

1. Volte para **Clients** → `xfinder-web`
2. Na aba **Settings**, verifique:
    - ✅ **Client ID**: `xfinder-web`
    - ✅ **Access Type**: `public`
    - ✅ **Standard Flow Enabled**: `ON`
    - ✅ **Direct Access Grants Enabled**: `ON`
    - ✅ **Valid Redirect URIs**: contém `http://localhost:8080/*`
    - ✅ **Web Origins**: contém `http://localhost:8080`

3. Role até Capability config), verifique:
    - ✅ **PKCE Method**: `S256`

## Passo 10: Atualizar Configuração do Backend (se necessário)

Se você estiver usando uma porta diferente ou URL diferente do Keycloak, atualize o arquivo `xfa-api/src/main/resources/application.properties`:

```properties
# Se o Keycloak estiver em HTTPS na porta 8443
quarkus.oidc.auth-server-url=https://localhost:8443/realms/xfinder
```

## Resumo das Configurações

- **Realm**: `xfinder`
- **Client ID**: `xfinder-web`
- **Client Type**: `public` (OpenID Connect)
- **PKCE**: Habilitado com método `S256`
- **Valid Redirect URIs**: `http://localhost:8080/*`
- **Web Origins**: `http://localhost:8080`
- **Roles**: `customer`, `admin`, `seller`
- **Default Role**: `customer`

## Troubleshooting

### Erro: "Invalid redirect URI"
- Verifique se a URL de redirecionamento está exatamente como configurada no Keycloak
- Certifique-se de que `http://localhost:8080/*` está em **Valid redirect URIs**

### Erro: "PKCE code challenge method mismatch"
- Verifique se o método PKCE está configurado como `S256` no Keycloak:
    1. Vá para **Clients** → `xfinder-web` → aba **Settings**
    2. Role até **Advanced settings**
    3. Verifique se **Proof Key for Code Exchange Code Challenge Method** está como `S256`
- Verifique se o frontend está usando `S256` na configuração:
    - Arquivo: `xfa-web/src/config/keycloak.ts`
    - Deve ter: `pkceMethod: 'S256'`
- Se o erro persistir, tente limpar o cache do navegador e fazer logout/login novamente

### Erro: CORS
- Certifique-se de que `http://localhost:8080` está em **Web origins**
- Em desenvolvimento, você pode usar `*` (não recomendado para produção)

### Token não contém roles
- Verifique se os mappers de roles estão configurados corretamente
- Verifique se o usuário tem as roles atribuídas

## Próximos Passos

Após configurar o Keycloak:

1. Inicie o backend Quarkus
2. Inicie o frontend React
3. Teste o fluxo de login
4. Verifique se o Customer é sincronizado corretamente

## Referências

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)
- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)

