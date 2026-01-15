# Configuração SSL para Desenvolvimento - Keycloak

Este documento explica como configurar o Quarkus para aceitar certificados SSL auto-assinados do Keycloak em desenvolvimento.

## Problema

Quando o Keycloak usa HTTPS com certificado auto-assinado, o Java (e consequentemente o Quarkus) não confia no certificado por padrão, resultando no erro:

```
javax.net.ssl.SSLHandshakeException: PKIX path building failed: 
sun.security.provider.certpath.SunCertPathBuilderException: 
unable to find valid certification path to requested target
```

## Solução Implementada

A solução utiliza apenas configurações no `application.properties`:

### Configurações no application.properties

Adicionadas as seguintes propriedades no `application.properties`:

```properties
# Apenas em desenvolvimento (%dev)
%dev.quarkus.tls.trust-all=true
%dev.quarkus.oidc.tls.verification=none
%dev.quarkus.oidc-client.tls.verification=none
%dev.quarkus.rest-client."superfrete-api".trust-all=true
```

Essas propriedades são suficientes para fazer o Quarkus aceitar certificados auto-assinados do Keycloak em desenvolvimento.

## Como Funciona

- **Em Desenvolvimento (`%dev`)**: 
  - Validação SSL é desabilitada
  - Aceita certificados auto-assinados
  - Permite conexão com Keycloak HTTPS

- **Em Produção (`%prod`)**: 
  - Validação SSL é mantida (segurança)
  - Certificados devem ser válidos e confiáveis

## ⚠️ IMPORTANTE - Segurança

**NUNCA use essas configurações em produção!**

Em produção, você deve:
1. Usar certificados SSL válidos e confiáveis
2. Configurar o Keycloak com certificado de uma CA confiável
3. Remover ou não ativar as configurações `%dev` em produção

## Alternativa: Usar HTTP em Desenvolvimento

Se preferir, você pode configurar o Keycloak para usar HTTP em desenvolvimento:

1. No `application.properties`, altere:
   ```properties
   %dev.quarkus.oidc.auth-server-url=http://localhost:9000/realms/xfinder
   ```

2. No Keycloak, inicie com `--http-enabled=true` (já configurado no Dockerfile)

3. Acesse via `http://localhost:9000` em vez de `https://localhost:8443`

## Verificação

Após aplicar as configurações:

1. Reinicie o backend Quarkus em modo dev:
   ```bash
   ./mvnw quarkus:dev
   ```

2. Verifique se as propriedades `%dev` estão sendo aplicadas (verifique os logs)

3. Tente fazer login novamente

4. Os erros 500 relacionados a SSL devem desaparecer

## Troubleshooting

### Erro persiste após configuração

1. Verifique se está rodando em modo `dev`:
   ```bash
   # Deve iniciar com quarkus:dev
   ./mvnw quarkus:dev
   ```

2. Verifique se as propriedades `%dev` estão sendo aplicadas:
   - As propriedades com prefixo `%dev.` só funcionam em modo desenvolvimento
   - Em modo produção, elas são ignoradas

3. Verifique se o Quarkus está conseguindo se conectar ao Keycloak:
   - Teste a URL do Keycloak manualmente: `https://localhost:8443/realms/xfinder/.well-known/openid-configuration`
   - Verifique se o Keycloak está rodando e acessível

### Erro em Produção

Se você ver o aviso SSL em produção, verifique:
- O profile está configurado como `prod`
- As propriedades `%dev` não estão sendo aplicadas em produção

## Referências

- [Quarkus OIDC Documentation](https://quarkus.io/guides/security-openid-connect)
- [Java SSL/TLS Configuration](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html)

