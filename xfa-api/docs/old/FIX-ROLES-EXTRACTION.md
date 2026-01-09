# Fix: Roles não sendo extraídas pelo Quarkus

## Problema Identificado

Pelos logs, vemos que:
- ✅ O token **TEM** as roles: `realm_access.roles: ["default-roles-xfinder","offline_access","uma_authorization","customer"]`
- ❌ Mas `SecurityIdentity.getRoles()` está **VAZIO**: `[]`

Isso significa que o Quarkus não está extraindo as roles do access token, mesmo com a configuração correta.

## Análise dos Logs

```
realm_access.roles: ["default-roles-xfinder","offline_access","uma_authorization","customer"]
Roles (SecurityIdentity.getRoles()): []
Roles count: 0
```

O token está correto, mas o Quarkus não está lendo as roles.

## Soluções a Tentar

### Solução 1: Verificar Configuração do Mapper no Keycloak

O mapper "Realm role" no Keycloak pode não estar configurado corretamente. Verifique:

1. Acesse Keycloak Admin Console
2. Vá para **Clients** → `xfinder-web`
3. **Client scopes** → `xfinder-web-dedicated` (ou o scope dedicado)
4. **Mappers** → Clique no mapper "Realm role"
5. Verifique se:
   - **Token Claim Name**: `realm_access.roles` (ou deixe vazio para usar o padrão)
   - **Add to ID token**: **ON** ✅
   - **Add to access token**: **ON** ✅ (MUITO IMPORTANTE!)
   - **Add to userinfo**: **ON** ✅

### Solução 2: Tentar userinfo em vez de accesstoken

Mude a configuração em `application.properties`:

```properties
# Comentar a linha atual
# quarkus.oidc.roles.source=accesstoken

# Usar userinfo
quarkus.oidc.roles.source=userinfo
```

Isso faz o Quarkus buscar as roles do endpoint `/userinfo` do Keycloak em vez do token.

### Solução 3: Verificar se o Mapper está no Scope Correto

O mapper "Realm role" pode estar no scope errado. Verifique:

1. **Clients** → `xfinder-web`
2. **Client scopes** → Verifique qual scope está sendo usado
3. Se estiver usando `xfinder-web-dedicated`, o mapper deve estar lá
4. Se estiver usando um scope padrão (como `roles`), o mapper deve estar lá

### Solução 4: Criar Mapper Customizado

Se o mapper pré-definido não funcionar, crie um mapper customizado:

1. **Clients** → `xfinder-web` → **Client scopes** → `xfinder-web-dedicated` → **Mappers**
2. Clique em **Add mapper** → **By configuration**
3. Selecione **User Realm Role**
4. Configure:
   - **Name**: `realm-roles`
   - **Token Claim Name**: `realm_access.roles` (ou deixe vazio)
   - **Claim JSON Type**: `String` (ou `JSON` se quiser o objeto completo)
   - **Add to ID token**: **ON** ✅
   - **Add to access token**: **ON** ✅
   - **Add to userinfo**: **ON** ✅
5. Clique em **Save**

### Solução 5: Verificar Versão do Quarkus

Algumas versões do Quarkus têm bugs conhecidos com extração de roles. Verifique se está usando uma versão estável.

## Próximos Passos

1. **Primeiro**: Verifique o mapper no Keycloak (Solução 1)
2. **Segundo**: Tente usar `userinfo` (Solução 2) - mude em `application.properties` e reinicie
3. **Terceiro**: Crie um mapper customizado (Solução 4)

## Como Testar

Após cada mudança:

1. Reinicie o backend
2. Faça logout e login novamente no frontend (para obter novo token)
3. Tente acessar `/api/auth/customer`
4. Verifique os logs - `SecurityIdentity.getRoles()` deve conter as roles

## Referências

- [Quarkus OIDC Roles Documentation](https://quarkus.io/guides/security-openid-connect#roles)
- [Keycloak Token Mappers](https://www.keycloak.org/docs/latest/server_admin/#_protocol_mappers)

