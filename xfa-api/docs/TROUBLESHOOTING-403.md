# Troubleshooting: Erro 403 (Forbidden) na Autenticação

## Problema

Após autenticar com sucesso no Keycloak, os endpoints retornam erro 403 (Forbidden):
- `GET /api/auth/customer` → 403
- `POST /api/auth/sync` → 403

## Causa

O erro 403 indica que:
1. ✅ O token JWT está sendo enviado corretamente
2. ✅ O token está sendo validado pelo Quarkus
3. ❌ O usuário **não tem as roles necessárias** ou as roles não estão sendo extraídas corretamente do token

## Soluções

### Solução 1: Verificar Roles no Keycloak

1. Acesse o Keycloak Admin Console
2. Vá para **Users** → Selecione seu usuário
3. Clique na aba **Role mapping**
4. Clique em **Assign role**
5. Selecione **Filter by realm roles**
6. Atribua a role **customer** ao usuário
7. Clique em **Assign**

### Solução 2: Verificar Mapper de Roles no Keycloak

1. Acesse **Clients** → `xfinder-web`
2. Clique na aba **Client scopes**
3. Clique em **xfinder-web-dedicated** (ou o scope dedicado)
4. Clique na aba **Mappers**
5. Verifique se existe um mapper chamado **Realm role** ou **realm roles**
6. Se não existir, adicione:
   - Clique em **Add predefined mapper**
   - Selecione **Realm role**
   - Clique em **Add**
7. Verifique as configurações do mapper:
   - **Token Claim Name**: deve ser `realm_access.roles` (ou apenas `roles`)
   - **Add to ID token**: **ON** ✅
   - **Add to access token**: **ON** ✅
   - **Add to userinfo**: **ON** ✅

### Solução 3: Usar Endpoint de Debug

Foi criado um endpoint de debug para verificar o que está no token:

```bash
# Faça login no frontend primeiro, depois chame:
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:8081/api/auth/debug
```

Ou acesse via navegador (se estiver autenticado):
```
http://localhost:8081/api/auth/debug
```

Este endpoint mostra:
- Se o usuário está autenticado
- Quais roles estão disponíveis
- Estrutura completa do token JWT
- Onde as roles estão localizadas no token

### Solução 4: Verificar Configuração do Quarkus

No arquivo `application.properties`, verifique:

```properties
# Deve estar configurado assim:
quarkus.oidc.roles.role-claim-path=realm_access.roles
quarkus.oidc.roles.source=token
```

### Solução 5: Verificar Token JWT Manualmente

1. No frontend, abra o console do navegador
2. Execute:
   ```javascript
   // Se estiver usando keycloak-js
   console.log(keycloak.tokenParsed);
   ```
3. Verifique se existe `realm_access.roles` no token
4. Verifique se a role `customer` está na lista

### Solução 6: Configuração Temporária para Desenvolvimento

Se você quiser permitir acesso autenticado mesmo sem roles específicas (apenas para desenvolvimento), você pode:

1. Remover temporariamente `@RolesAllowed` dos endpoints
2. Ou criar um endpoint público que verifica autenticação manualmente

**⚠️ ATENÇÃO**: Isso é apenas para desenvolvimento! Nunca faça isso em produção!

## Verificação Rápida

Execute este teste para verificar se as roles estão sendo extraídas:

```bash
# 1. Faça login no frontend
# 2. No console do navegador, execute:
fetch('http://localhost:8081/api/auth/check', {
  headers: {
    'Authorization': 'Bearer ' + keycloak.token
  }
})
.then(r => r.json())
.then(console.log);
```

Isso deve mostrar:
- `authenticated: true`
- `roles: ["customer"]` (ou outras roles)

## Checklist de Verificação

- [ ] Usuário tem a role `customer` atribuída no Keycloak
- [ ] Mapper de roles está configurado no Client Scope
- [ ] Token JWT contém `realm_access.roles` com a role `customer`
- [ ] Configuração `quarkus.oidc.roles.role-claim-path=realm_access.roles` está correta
- [ ] Backend está rodando em modo `dev` (para aplicar configurações `%dev`)

## Solução Temporária Implementada

Foi implementada uma solução temporária que permite acesso autenticado aos endpoints `/api/auth/customer` e `/api/auth/sync` **mesmo sem roles específicas**, apenas verificando se o usuário está autenticado.

**⚠️ ATENÇÃO**: Esta é uma solução apenas para desenvolvimento! Em produção, você deve:

1. Configurar as roles no Keycloak (Solução 1)
2. Configurar o mapper de roles (Solução 2)
3. Reativar `@RolesAllowed` nos endpoints em `AuthResource.java`

### Como Reativar a Verificação de Roles

Após configurar as roles no Keycloak:

1. Abra `xfa-api/src/main/java/com/xfinder/api/auth/AuthResource.java`
2. Descomente as linhas `@RolesAllowed({"customer", "admin", "seller"})` nos métodos:
   - `getCurrentUser()`
   - `getCurrentCustomer()`
   - `syncCustomer()`
3. Descomente o import: `import jakarta.annotation.security.RolesAllowed;`
4. Remova as verificações manuais de `securityIdentity.isAnonymous()` (o `@RolesAllowed` já faz isso)

## Próximos Passos

Após verificar e corrigir as roles:

1. Faça logout e login novamente no frontend (para obter novo token com roles)
2. Teste novamente os endpoints
3. Se ainda der 403, use o endpoint `/api/auth/debug` para ver o que está no token
4. Reative `@RolesAllowed` nos endpoints após confirmar que as roles estão funcionando

## Referências

- [Keycloak Role Mapping](https://www.keycloak.org/docs/latest/server_admin/#_role_mappings)
- [Quarkus OIDC Roles](https://quarkus.io/guides/security-openid-connect#roles)

