# Solução Final: Configuração de Roles que Funciona

## Problema Identificado

O Quarkus não estava extraindo as roles do token mesmo com `realm_access.roles` presente no token. Após analisar o projeto `angular-quarkus` que funciona, descobrimos a diferença:

## Diferença Principal

### ❌ Configuração Anterior (NÃO funcionava)
```properties
quarkus.oidc.roles.role-claim-path=realm_access.roles
quarkus.oidc.roles.source=userinfo
```

### ✅ Configuração Correta (do projeto que funciona)
```properties
quarkus.oidc.roles.role-claim-path=roles
quarkus.oidc.roles.source=accesstoken
```

## Solução Implementada

### 1. Mudança no `application.properties`

Alterado para usar o claim simples `roles` em vez de `realm_access.roles`:

```properties
quarkus.oidc.roles.role-claim-path=roles
quarkus.oidc.roles.source=accesstoken
quarkus.log.category."io.quarkus.oidc".level=DEBUG
quarkus.log.category."io.quarkus.security".level=DEBUG
```

### 2. Configuração do Mapper no Keycloak

O mapper deve adicionar roles no claim `roles` (não aninhado):

1. Acesse Keycloak Admin Console
2. Vá para **Clients** → `xfinder-web` → **Client scopes** → `xfinder-web-dedicated` → **Mappers**
3. Se já existe o mapper "Realm role", edite-o
4. Se não existe, crie um novo:
   - **Add mapper** → **By configuration** → **User Realm Role**
5. Configure:
   - **Name**: `roles`
   - **Token Claim Name**: `roles` ⚠️ **IMPORTANTE: Use `roles` (simples), não `realm_access.roles`!**
   - **Multivalued**: **ON** ✅
   - **Add to access token**: **ON** ✅ (CRÍTICO!)
   - **Add to ID token**: **ON** ✅
   - **Add to userinfo**: **ON** ✅
6. Clique em **Save**

## Por que isso funciona?

1. **Claim simples é mais confiável**: O Quarkus tem problemas para extrair roles de caminhos aninhados como `realm_access.roles`, especialmente quando o nome do client contém hífen.

2. **Mapper customizado**: Criar um mapper que adiciona roles diretamente no claim `roles` é a abordagem recomendada pelo projeto que funciona.

3. **accesstoken em vez de userinfo**: Usar `accesstoken` é mais direto e eficiente do que fazer uma chamada adicional ao endpoint `/userinfo`.

## Próximos Passos

1. **Configure o mapper no Keycloak** conforme descrito acima
2. **Reinicie o backend** Quarkus
3. **Faça logout e login novamente** no frontend (para obter novo token)
4. **Teste os endpoints** - agora devem funcionar!

## Verificação

Após configurar, o token JWT deve ter:
```json
{
  "roles": ["default-roles-xfinder", "offline_access", "uma_authorization", "customer"],
  ...
}
```

E o Quarkus deve extrair essas roles corretamente:
```
Roles (SecurityIdentity.getRoles()): [customer, ...]
```

## Referência

Esta solução foi baseada no projeto `angular-quakus/backA` que está funcionando corretamente com Keycloak e Quarkus.

