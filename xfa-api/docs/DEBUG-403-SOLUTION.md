# Solução para Debug do Erro 403

## Problema

O erro 403 está ocorrendo ANTES dos métodos serem executados, então os logs dentro dos métodos nunca aparecem. O Quarkus está rejeitando a requisição na camada de autorização.

## Solução Implementada

### 1. ExceptionMapper (AuthExceptionMapper.java)

Criado um `ExceptionMapper` que captura exceções `ForbiddenException` (403) e loga todas as informações do token **quando o erro ocorre**.

**Como funciona:**
- Quando o Quarkus lança uma `ForbiddenException` (por falta de roles), o `ExceptionMapper` intercepta
- Ele loga todas as informações do token JWT, incluindo:
  - Roles do SecurityIdentity
  - `realm_access.roles` do token
  - Todos os claims disponíveis

**Arquivo**: `xfa-api/src/main/java/com/xfinder/api/auth/AuthExceptionMapper.java`

### 2. Logs nos Métodos (AuthResource.java)

Adicionado log no início dos métodos para confirmar se eles são executados (se chegar lá, significa que passou pela verificação de roles).

## Como Usar

1. **Reinicie o backend** (se ainda não reiniciou):
   ```bash
   cd xfa-api
   ./mvnw quarkus:dev
   ```

2. **Faça uma requisição** que resulta em 403 (login no frontend e tente acessar `/api/auth/customer`)

3. **Verifique os logs do backend** - você deve ver:
   ```
   ═══════════════════════════════════════════════════════
   ❌ ERRO 403 (Forbidden) DETECTADO!
   ═══════════════════════════════════════════════════════
   SecurityIdentity.isAnonymous(): false
   Principal: ...
   Roles (SecurityIdentity.getRoles()): []
   Roles count: 0
   realm_access: {roles=[customer]}
   realm_access.roles: [customer]
   Contém 'customer'? true
   Todos os claims disponíveis:
     - sub: ...
     - email: ...
     - realm_access: ...
   ═══════════════════════════════════════════════════════
   ```

## Análise dos Logs

### Se você ver:
- `Roles (SecurityIdentity.getRoles()): []` mas `realm_access.roles: [customer]`
  - **Problema**: O Quarkus não está extraindo as roles do token
  - **Solução**: Verificar configuração `quarkus.oidc.roles.source` e `quarkus.oidc.roles.role-claim-path`

- `realm_access: null` ou `realm_access.roles: null`
  - **Problema**: As roles não estão no access token
  - **Solução**: Verificar mapper no Keycloak - garantir que está adicionando roles ao **access token**

- `SecurityIdentity.isAnonymous(): true`
  - **Problema**: Token não está sendo validado ou não está sendo enviado
  - **Solução**: Verificar se o token está no header `Authorization: Bearer ...`

## Próximos Passos

Após ver os logs:

1. **Se as roles estão no token mas não no SecurityIdentity**:
   - Verificar se `quarkus.oidc.roles.source=accesstoken` está correto
   - Tentar mudar para `quarkus.oidc.roles.source=idtoken` (e mudar frontend para enviar ID token)
   - Verificar se `quarkus.oidc.roles.role-claim-path=realm_access.roles` está correto

2. **Se as roles não estão no token**:
   - Verificar mapper no Keycloak
   - Garantir que o mapper "Realm role" está configurado para adicionar ao **access token**
   - Verificar se o usuário tem a role `customer` atribuída

3. **Se o token não está sendo enviado**:
   - Verificar `apiClient.ts` no frontend
   - Verificar se `keycloak.token` está disponível
   - Verificar se o header `Authorization` está sendo enviado

## Referências

- [Quarkus OIDC Roles](https://quarkus.io/guides/security-openid-connect#roles)
- [Quarkus Exception Mappers](https://quarkus.io/guides/resteasy-reactive#exception-mapping)
- [Keycloak Token Mappers](https://www.keycloak.org/docs/latest/server_admin/#_protocol_mappers)

