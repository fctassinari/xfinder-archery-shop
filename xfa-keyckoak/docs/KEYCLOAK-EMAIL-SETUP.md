# Configuração de Email no Keycloak para Recuperação de Senha

Este guia explica como configurar o envio de emails no Keycloak para habilitar a funcionalidade de recuperação de senha.

## Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Configuração via Variáveis de Ambiente (Recomendado)](#configuração-via-variáveis-de-ambiente-recomendado)
- [Configuração Manual via Admin Console](#configuração-manual-via-admin-console)
- [Teste da Configuração](#teste-da-configuração)
- [Habilitar Verificação de Email (Opcional)](#habilitar-verificação-de-email-opcional)
- [Troubleshooting](#troubleshooting)
- [Considerações de Segurança](#considerações-de-segurança)

## Visão Geral

O Keycloak precisa de um servidor SMTP configurado para enviar emails de:
- Recuperação de senha
- Verificação de email
- Notificações de conta
- Outros emails do sistema

Este projeto utiliza o Gmail SMTP já configurado no backend Quarkus.

## Pré-requisitos

1. **Conta Gmail com App Password configurada**
   - Acesse: https://myaccount.google.com/apppasswords
   - Gere uma "App Password" para o Keycloak
   - **IMPORTANTE**: Use a App Password, não a senha normal da conta

2. **Credenciais necessárias:**
   - Email: `contato.xfinder@gmail.com`
   - App Password: (gerada no passo acima)
   - Servidor SMTP: `smtp.gmail.com`
   - Porta: `465` (SSL) ou `587` (STARTTLS)

## Configuração via Variáveis de Ambiente (Recomendado)

Esta é a forma recomendada, pois mantém as credenciais seguras e facilita o gerenciamento por ambiente.

### Para Produção (docker-compose.prod.yml)

As variáveis já estão configuradas no arquivo `docker-compose.prod.yml`:

```yaml
environment:
  - KC_SMTP_HOST=smtp.gmail.com
  - KC_SMTP_PORT=465
  - KC_SMTP_FROM=contato.xfinder@gmail.com
  - KC_SMTP_FROM_DISPLAY_NAME=X-Finder Archery Shop
  - KC_SMTP_USERNAME=contato.xfinder@gmail.com
  - KC_SMTP_PASSWORD=bpir kvyk osew qxkz
  - KC_SMTP_SSL_ENABLED=true
  - KC_SMTP_STARTTLS_ENABLED=false
```

**Como funciona:**
- As variáveis de ambiente `KC_SMTP_*` são aplicadas automaticamente pelo Keycloak na inicialização
- Elas sobrescrevem qualquer configuração no `realm-export.json`
- A senha **NÃO** é armazenada no `realm-export.json` (apenas nas variáveis de ambiente)
- O arquivo `realm-export.json` contém apenas valores padrão para referência

**Para atualizar a senha:**
1. Edite o arquivo `docker-compose.prod.yml`
2. Atualize a variável `KC_SMTP_PASSWORD` com a nova App Password
3. Reinicie o container: `docker-compose -f docker-compose.prod.yml restart keycloak`

### Para Desenvolvimento (Dockerfile)

As variáveis também estão configuradas no `Dockerfile` para desenvolvimento local.

**Nota**: Em desenvolvimento, você pode querer usar variáveis de ambiente do sistema ao invés de hardcoded no Dockerfile. Para isso, remova as linhas ENV do Dockerfile e configure no seu ambiente.

## Configuração Manual via Admin Console

Se preferir configurar manualmente ou precisar ajustar configurações específicas:

### Passo 1: Acessar o Admin Console

1. Acesse: `https://localhost:8443` (desenvolvimento) ou `https://xfinder-archery.com.br` (produção)
2. Faça login com credenciais de administrador
3. Selecione o realm `xfinder`

### Passo 2: Configurar SMTP

1. No menu lateral esquerdo, clique em **Realm settings**
2. Clique na aba **Email**
3. Preencha os campos:

   **Host**: `smtp.gmail.com`
   
   **Port**: `465` (para SSL) ou `587` (para STARTTLS)
   
   **From**: `contato.xfinder@gmail.com`
   
   **From display name**: `X-Finder Archery Shop`
   
   **Reply to**: `contato.xfinder@gmail.com` (opcional)
   
   **Reply to display name**: `X-Finder Archery Shop` (opcional)
   
   **Enable SSL**: ✅ **ON** (se usar porta 465)
   
   **Enable StartTLS**: ✅ **ON** (se usar porta 587)
   
   **Enable Authentication**: ✅ **ON**
   
   **Username**: `contato.xfinder@gmail.com`
   
   **Password**: (cole a App Password do Gmail)

4. Clique em **Save**

### Passo 3: Testar Conexão

1. Na mesma página, role até o final
2. Clique no botão **Test connection**
3. Se a configuração estiver correta, você verá uma mensagem de sucesso
4. Se houver erro, verifique:
   - Credenciais corretas
   - Porta e SSL/STARTTLS corretos
   - Firewall não bloqueando conexão
   - App Password válida (não expirada)

## Teste da Configuração

### Teste 1: Envio de Email de Teste

1. No Admin Console, vá para **Realm settings** → **Email**
2. Clique em **Test connection**
3. Verifique se recebe uma mensagem de sucesso

### Teste 2: Recuperação de Senha

1. Acesse a página de login do Keycloak
2. Clique em **Esqueci minha senha** (Forgot Password)
3. Digite o email de um usuário existente
4. Verifique se o email de recuperação foi recebido
5. Clique no link do email e defina uma nova senha

### Teste 3: Verificar Logs

Se houver problemas, verifique os logs do Keycloak:

```bash
# Para Docker/Podman
docker logs xfinder-keycloak-prod
# ou
podman logs xfinder-keycloak
```

Procure por mensagens relacionadas a SMTP ou email.

## Habilitar Verificação de Email (Opcional)

Para exigir que usuários verifiquem o email antes de usar a conta:

1. No Admin Console, vá para **Realm settings**
2. Clique na aba **Login**
3. Role até a seção **User registration**
4. Marque **Email as username** (opcional - permite login com email)
5. Marque **Verify email** ✅
6. Clique em **Save**

**Nota**: Com esta opção habilitada, após o registro o usuário receberá um email para verificar a conta antes de poder fazer login.

## Troubleshooting

### Erro: "Authentication failed"

**Causa**: Senha incorreta ou App Password inválida

**Solução**:
1. Verifique se está usando a App Password (não a senha normal)
2. Gere uma nova App Password em: https://myaccount.google.com/apppasswords
3. Atualize a configuração com a nova senha

### Erro: "Connection timeout"

**Causa**: Firewall bloqueando ou porta incorreta

**Solução**:
1. Verifique se a porta 465 (SSL) ou 587 (STARTTLS) está acessível
2. Teste a conexão SMTP manualmente:
   ```bash
   telnet smtp.gmail.com 465
   ```
3. Verifique configurações de firewall/proxy

### Erro: "SSL handshake failed"

**Causa**: Configuração SSL/STARTTLS incorreta

**Solução**:
- Se usando porta 465: `Enable SSL = ON`, `Enable StartTLS = OFF`
- Se usando porta 587: `Enable SSL = OFF`, `Enable StartTLS = ON`

### Email não chega / Vai para spam

**Causa**: Configurações de SPF/DKIM ou problemas de reputação

**Solução**:
1. Verifique a pasta de spam
2. Adicione `contato.xfinder@gmail.com` aos contatos
3. Configure SPF/DKIM no domínio (se usar domínio próprio)
4. Use um serviço de email transacional (SendGrid, Mailgun, etc.) para produção

### Variáveis de ambiente não funcionam

**Causa**: Keycloak não reconhece as variáveis ou formato incorreto

**Solução**:
1. Verifique se as variáveis estão no formato correto: `KC_SMTP_*`
2. Reinicie o container após adicionar variáveis
3. Verifique logs para erros de parsing
4. Use configuração manual via Admin Console como alternativa

## Considerações de Segurança

### 1. App Password do Gmail

- **NUNCA** use a senha normal da conta Gmail
- Use sempre uma "App Password" gerada especificamente para o Keycloak
- App Passwords podem ser revogadas a qualquer momento em: https://myaccount.google.com/apppasswords

### 2. Variáveis de Ambiente vs Hardcoded

- ✅ **Recomendado**: Usar variáveis de ambiente (docker-compose, Dockerfile ENV)
- ❌ **Evitar**: Hardcoded em arquivos de configuração versionados
- ✅ **Ideal**: Usar secrets management (Docker Secrets, Kubernetes Secrets, etc.) em produção

### 3. Senha no Realm Export

- O arquivo `realm-export.json` **NÃO** contém a senha SMTP
- A senha deve vir sempre de variáveis de ambiente
- **NUNCA** commite senhas no repositório Git

### 4. Rotação de Senhas

- Rotacione App Passwords periodicamente
- Quando rotacionar, atualize:
  1. Variável `KC_SMTP_PASSWORD` no docker-compose.prod.yml
  2. Reinicie o container
  3. Teste o envio de email

### 5. Limites do Gmail

- Gmail tem limites de envio (500 emails/dia para contas gratuitas)
- Para produção com alto volume, considere:
  - Gmail Workspace (limites maiores)
  - Serviço de email transacional (SendGrid, Mailgun, AWS SES, etc.)

## Fluxo de Recuperação de Senha

1. **Usuário solicita recuperação**
   - Acessa página de login
   - Clica em "Esqueci minha senha"
   - Informa email ou username

2. **Keycloak processa solicitação**
   - Valida se o usuário existe
   - Gera token de reset temporário
   - Envia email com link de reset

3. **Usuário recebe email**
   - Email contém link único e temporário
   - Link expira após tempo configurado (padrão: 5 minutos)

4. **Usuário redefine senha**
   - Clica no link do email
   - É redirecionado para página de reset
   - Define nova senha

5. **Confirmação (opcional)**
   - Keycloak pode enviar email de confirmação
   - Usuário pode fazer login com nova senha

## Configurações Avançadas

### Personalizar Templates de Email

Os templates de email podem ser customizados no tema:

1. Edite arquivos em `xfa-keyckoak/themes/xfinder-archery/email/`
2. Templates disponíveis:
   - `password-reset.ftl` - Email de reset de senha
   - `verification.ftl` - Email de verificação
   - `email-html.ftl` - Template HTML base

### Configurar Tempo de Expiração do Token

1. **Realm settings** → **Tokens**
2. Ajuste **Action Token Generated By User Lifespan** (padrão: 5 minutos)
3. Clique em **Save**

### Configurar Assunto e Corpo do Email

1. **Realm settings** → **Email**
2. Role até **Email theme**
3. Selecione o tema customizado (se aplicável)
4. Edite os arquivos de template no tema

## Referências

- [Keycloak Email Documentation](https://www.keycloak.org/docs/latest/server_admin/#_email)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Keycloak SMTP Configuration](https://www.keycloak.org/server/configuration#_email)

## Suporte

Se encontrar problemas não cobertos neste guia:

1. Verifique os logs do Keycloak
2. Consulte a documentação oficial do Keycloak
3. Teste a configuração SMTP manualmente (telnet, openssl)
4. Verifique configurações de firewall/proxy
