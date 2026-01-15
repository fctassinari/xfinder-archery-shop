# Debug: Erro 403 - Roles não sendo reconhecidas

## Problema

O erro 403 está ocorrendo ANTES do método ser executado, então os logs dentro dos métodos nunca aparecem. Isso significa que o Quarkus está rejeitando a requisição na camada de autorização.

## Solução Implementada

### 1. Filtro de Logging (TokenLoggingFilter)

Criado um filtro JAX-RS que intercepta TODAS as requisições para `/api/auth/*` ANTES da verificação de roles. Este filtro vai logar:

- Se o token está presente no header
- Se o SecurityIdentity está autenticado
- Todas as roles disponíveis
- O conteúdo completo de `realm_access`
- Todos os claims do token

**Arquivo**: `xfa-api/src/main/java/com/xfinder/api/auth/TokenLoggingFilter.java`

### 2. Configuração de Roles

A configuração atual está usando `accesstoken` como fonte de roles:

```properties
quarkus.oidc.roles.source=accesstoken
```

**IMPORTANTE**: O frontend está enviando o **ACCESS TOKEN** (`keycloak.token`), não o ID token.

### 3. Possíveis Causas do Problema

1. **Roles não estão no Access Token**: As roles podem estar apenas no ID token, não no access token
2. **Mapper não está configurado corretamente**: O mapper de roles no Keycloak pode não estar incluindo roles no access token
3. **Path de roles incorreto**: O Quarkus pode estar procurando roles em um path diferente

## Como Debuggar

### Passo 1: Verificar os Logs do Filtro

Após reiniciar o backend, faça uma requisição e verifique os logs. Você deve ver algo como:

```
=== TOKEN FILTER [/api/auth/customer] ===
Method: GET
Token presente no header (primeiros 50 chars): eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
SecurityIdentity.isAnonymous(): false
Principal: ...
Subject (sub): ...
Email: ...
Roles (SecurityIdentity.getRoles()): []
Roles count: 0
realm_access: {roles=[customer]}
realm_access.roles: [customer]
Contém 'customer'? true
========================================
```

### Passo 2: Analisar os Logs

Se você ver:
- `Roles (SecurityIdentity.getRoles()): []` mas `realm_access.roles: [customer]` → O Quarkus não está extraindo as roles do token
- `realm_access: null` → As roles não estão no token (problema no Keycloak)
- `Token NÃO encontrado no header` → Problema no frontend

### Passo 3: Tentar Alternativas

#### Opção A: Mudar para ID Token

Se as roles estiverem apenas no ID token, mude a configuração:

```properties
# Comentar a linha atual
# quarkus.oidc.roles.source=accesstoken

# Usar ID token
quarkus.oidc.roles.source=idtoken
```

**ATENÇÃO**: Isso requer que o frontend envie o ID token, não o access token. Você precisaria mudar:

```typescript
// Em apiClient.ts
config.headers.Authorization = `Bearer ${keycloak.idToken}`; // Em vez de keycloak.token
```

#### Opção B: Verificar Mapper no Keycloak

1. Acesse Keycloak Admin Console
2. Vá para **Clients** → `xfinder-web`
3. **Client scopes** → `xfinder-web-dedicated` (ou o scope dedicado)
4. **Mappers** → Verifique o mapper "Realm role"
5. Certifique-se de que:
   - **Add to ID token**: ON ✅
   - **Add to access token**: ON ✅ (IMPORTANTE!)
   - **Token Claim Name**: `realm_access.roles` ou `roles`

#### Opção C: Usar UserInfo Endpoint

```properties
quarkus.oidc.roles.source=userinfo
```

Isso faz o Quarkus buscar roles do endpoint `/userinfo` do Keycloak.

## Checklist de Verificação

- [ ] Filtro TokenLoggingFilter está logando informações
- [ ] Token está presente no header Authorization
- [ ] SecurityIdentity não está anonymous
- [ ] `realm_access.roles` contém a role `customer` no token
- [ ] `SecurityIdentity.getRoles()` retorna as roles (não vazio)
- [ ] Mapper no Keycloak está configurado para adicionar roles ao access token
- [ ] Usuário tem a role `customer` atribuída no Keycloak

## Próximos Passos

1. **Reinicie o backend** para ativar o filtro
2. **Faça uma requisição** e verifique os logs
3. **Compartilhe os logs** para análise
4. **Ajuste a configuração** baseado no que os logs mostrarem

## Referências

- [Quarkus OIDC Roles](https://quarkus.io/guides/security-openid-connect#roles)
- [Keycloak Token Mappers](https://www.keycloak.org/docs/latest/server_admin/#_protocol_mappers)

