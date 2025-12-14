# Plano de Implementação: Autenticação com Keycloak

## Visão Geral

Implementar autenticação segura usando Keycloak 26.4.7 com OAuth2/OIDC, integrando React (frontend) e Quarkus (backend), mantendo dados cadastrais no PostgreSQL e dados de autenticação no Keycloak.

## Arquitetura

- **Frontend**: React com Keycloak JS Adapter usando Authorization Code Flow + PKCE
- **Backend**: Quarkus com OIDC para validação de tokens JWT
- **Keycloak**: Realm configurado com client público, roles e mappers
- **Sincronização**: Email como identificador único entre Customer (PostgreSQL) e Keycloak

## Fase 1: Configuração do Keycloak

### 1.1 Configurar Realm e Client

- Criar realm `xfinder` no Keycloak
- Criar client público `xfinder-web` com:
- Access Type: `public`
- Standard Flow: `enabled`
- Direct Access Grants: `enabled` (para desenvolvimento)
- PKCE Code Challenge Method: `S256`
- Valid Redirect URIs: `http://localhost:8080/*` (dev) e URLs de produção
- Web Origins: `*` (ajustar em produção)

### 1.2 Configurar Roles

- Criar roles: `customer`, `admin`, `seller` (se necessário)
- Configurar role `customer` como default para novos usuários

### 1.3 Configurar Mappers (opcional)

- Mapper para incluir email no token
- Mapper para incluir roles no token

## Fase 2: Backend - Integração Quarkus com Keycloak

### 2.1 Adicionar Dependências

Adicionar ao [`xfa-api/pom.xml`](../../xfa-api/pom.xml):

- `quarkus-oidc` - Para validação de tokens JWT
- `quarkus-oidc-client` - Para comunicação com Keycloak (se necessário)
- `quarkus-keycloak-authorization` - Para autorização baseada em roles

### 2.2 Configurar OIDC

Atualizar [`xfa-api/src/main/resources/application.properties`](../../xfa-api/src/main/resources/application.properties):

- Configurar `quarkus.oidc.auth-server-url`
- Configurar `quarkus.oidc.client-id`
- Configurar `quarkus.oidc.credentials.secret` (se client confidencial)
- Configurar CORS para incluir Authorization header

### 2.3 Atualizar Entidade Customer

Modificar [`xfa-api/src/main/java/com/xfinder/api/customers/Customer.java`](../../xfa-api/src/main/java/com/xfinder/api/customers/Customer.java):

- Adicionar campo opcional `keycloakId` (String, nullable) para melhor performance
- Manter email como identificador principal para sincronização

### 2.4 Criar Serviço de Sincronização

Criar [`xfa-api/src/main/java/com/xfinder/api/auth/KeycloakSyncService.java`](../../xfa-api/src/main/java/com/xfinder/api/auth/KeycloakSyncService.java):

- Método para sincronizar Customer com usuário Keycloak por email
- Método para criar Customer quando usuário se registra no Keycloak
- Método para atualizar Customer quando dados do Keycloak mudam

### 2.5 Criar Resource de Autenticação

Criar [`xfa-api/src/main/java/com/xfinder/api/auth/AuthResource.java`](../../xfa-api/src/main/java/com/xfinder/api/auth/AuthResource.java):

- Endpoint `GET /api/auth/me` - Retorna dados do usuário autenticado
- Endpoint `POST /api/auth/sync` - Sincroniza dados do Keycloak com Customer
- Endpoint `GET /api/auth/customer` - Retorna Customer vinculado ao usuário autenticado

### 2.6 Proteger Endpoints Existentes

Atualizar [`xfa-api/src/main/java/com/xfinder/api/customers/CustomerResource.java`](../../xfa-api/src/main/java/com/xfinder/api/customers/CustomerResource.java):

- Adicionar `@RolesAllowed("customer")` nos endpoints que precisam autenticação
- Endpoint de criação pode ser público (registro)
- Endpoint de atualização/deleção requer autenticação

### 2.7 Criar Filtro de Autenticação (se necessário)

Criar [`xfa-api/src/main/java/com/xfinder/api/auth/AuthFilter.java`](xfa-api/src/main/java/com/xfinder/api/auth/AuthFilter.java):

- Interceptar requisições e validar token JWT
- Extrair informações do usuário do token
- Vincular com Customer do banco

## Fase 3: Frontend - Integração React com Keycloak

### 3.1 Instalar Dependências

Adicionar ao [`xfa-web/package.json`](../../xfa-web/package.json):

- `keycloak-js` - Cliente JavaScript do Keycloak

### 3.2 Criar Configuração do Keycloak

Criar [`xfa-web/src/config/keycloak.ts`](../../xfa-web/src/config/keycloak.ts):

- Configurar URL do Keycloak
- Configurar realm e client-id
- Configurar opções (pkceMethod, checkLoginIframe, etc.)

### 3.3 Criar Contexto de Autenticação

Criar [`xfa-web/src/contexts/AuthContext.tsx`](../../xfa-web/src/contexts/AuthContext.tsx):

- Gerenciar estado de autenticação
- Métodos: `login()`, `logout()`, `isAuthenticated()`, `getUser()`, `getToken()`
- Sincronizar com Customer API quando usuário faz login
- Usar React Query para cache de dados do usuário

### 3.4 Criar Componentes de UI

Criar [`xfa-web/src/components/auth/LoginButton.tsx`](../../xfa-web/src/components/auth/LoginButton.tsx):

- Botão de login que redireciona para Keycloak

Criar [`xfa-web/src/components/auth/LogoutButton.tsx`](../../xfa-web/src/components/auth/LogoutButton.tsx):

- Botão de logout

Criar [`xfa-web/src/components/auth/UserMenu.tsx`](../../xfa-web/src/components/auth/UserMenu.tsx):

- Menu dropdown com informações do usuário
- Opções: Perfil, Pedidos, Logout

### 3.5 Criar Componente de Rota Protegida

Criar [`xfa-web/src/components/auth/PrivateRoute.tsx`](../../xfa-web/src/components/auth/PrivateRoute.tsx):

- Wrapper para rotas que requerem autenticação
- Redireciona para login se não autenticado

### 3.6 Atualizar App.tsx

Modificar [`xfa-web/src/App.tsx`](../../xfa-web/src/App.tsx):

- Adicionar `AuthProvider` envolvendo a aplicação
- Inicializar Keycloak no mount
- Adicionar rotas protegidas

### 3.7 Criar Serviço de API com Interceptor

Criar [`xfa-web/src/services/apiClient.ts`](../../xfa-web/src/services/apiClient.ts):

- Configurar axios com base URL
- Interceptor para adicionar token JWT no header Authorization
- Interceptor para tratar erros 401 (não autenticado) e 403 (sem permissão)

### 3.8 Atualizar Componentes Existentes

Modificar [`xfa-web/src/components/Header.tsx`](../../xfa-web/src/components/Header.tsx):

- Adicionar botão de login/logout
- Mostrar informações do usuário quando autenticado

Modificar [`xfa-web/src/components/Cart.tsx`](../../xfa-web/src/components/Cart.tsx):

- Integrar com dados do Customer autenticado
- Preencher automaticamente dados do cliente no checkout

### 3.9 Criar Página de Perfil

Criar [`xfa-web/src/pages/Profile.tsx`](../../xfa-web/src/pages/Profile.tsx):

- Exibir e editar dados do Customer
- Sincronizar com Keycloak quando necessário

## Fase 4: Segurança e Melhores Práticas

### 4.1 Configurações de Segurança

- HTTPS em produção (Keycloak e aplicação)
- Configurar token expiration adequado (access token: 5min, refresh: 30min)
- Habilitar refresh token rotation
- Configurar CORS adequadamente
- Validar origem das requisições

### 4.2 Tratamento de Erros

- Tratar erros de autenticação (token expirado, inválido)
- Implementar refresh automático de tokens
- Mensagens de erro amigáveis ao usuário

### 4.3 Sincronização de Dados

- Sincronizar Customer com Keycloak no primeiro login
- Atualizar Customer quando dados do Keycloak mudam
- Manter consistência entre Keycloak e PostgreSQL

## Fase 5: Testes e Validação

### 5.1 Testes Manuais

- Fluxo de registro de novo usuário
- Fluxo de login
- Fluxo de logout
- Acesso a rotas protegidas
- Sincronização de dados
- Refresh de tokens

### 5.2 Ajustes Finais

- Ajustar mensagens de erro
- Melhorar UX do fluxo de autenticação
- Documentar processo de configuração

## Arquivos a Criar/Modificar

### Backend (Java/Quarkus)

- `xfa-api/pom.xml` - Adicionar dependências
- `xfa-api/src/main/resources/application.properties` - Configurar OIDC
- `xfa-api/src/main/java/com/xfinder/api/customers/Customer.java` - Adicionar keycloakId
- `xfa-api/src/main/java/com/xfinder/api/auth/KeycloakSyncService.java` - Novo
- `xfa-api/src/main/java/com/xfinder/api/auth/AuthResource.java` - Novo
- `xfa-api/src/main/java/com/xfinder/api/auth/AuthFilter.java` - Novo (se necessário)
- `xfa-api/src/main/java/com/xfinder/api/customers/CustomerResource.java` - Adicionar @RolesAllowed

### Frontend (React/TypeScript)

- `xfa-web/package.json` - Adicionar keycloak-js
- `xfa-web/src/config/keycloak.ts` - Novo
- `xfa-web/src/contexts/AuthContext.tsx` - Novo
- `xfa-web/src/components/auth/LoginButton.tsx` - Novo
- `xfa-web/src/components/auth/LogoutButton.tsx` - Novo
- `xfa-web/src/components/auth/UserMenu.tsx` - Novo
- `xfa-web/src/components/auth/PrivateRoute.tsx` - Novo
- `xfa-web/src/services/apiClient.ts` - Novo
- `xfa-web/src/pages/Profile.tsx` - Novo
- `xfa-web/src/App.tsx` - Integrar AuthProvider
- `xfa-web/src/components/Header.tsx` - Adicionar autenticação
- `xfa-web/src/components/Cart.tsx` - Integrar com Customer autenticado

### Configuração

- Atualizar `xfa-keyckoak/Dockerfile` se necessário
- Criar documentação de configuração do Keycloak