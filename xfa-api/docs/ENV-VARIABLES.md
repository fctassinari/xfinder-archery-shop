# Configuração de Variáveis de Ambiente

Este documento descreve todas as variáveis de ambiente necessárias para executar a aplicação.

## Como Configurar

1. Crie um arquivo `.env` na raiz do projeto `xfa-api` (ou configure as variáveis no seu ambiente)
2. Copie os valores abaixo e preencha com os valores reais
3. **NUNCA** commite o arquivo `.env` com valores reais no repositório

## Variáveis de Ambiente Necessárias

### Configurações do Banco de Dados

```bash
DB_PASSWORD=your_database_password_here
```

- **Descrição**: Senha do banco de dados PostgreSQL
- **Obrigatório**: Sim
- **Exemplo**: `DB_PASSWORD=XFA@2025`

### Configurações da API Superfrete

```bash
# Token de desenvolvimento (sandbox)
SUPERFRETE_TOKEN_DEV=your_superfrete_dev_token_here

# Token de produção
SUPERFRETE_TOKEN_PROD=your_superfrete_prod_token_here
```

- **Descrição**: Tokens de autenticação da API Superfrete
- **Obrigatório**: Sim
- **Como obter**: Acesse o painel da Superfrete e gere os tokens

### Configurações do Gmail (Mailer)

```bash
GMAIL_PASSWORD=your_gmail_app_password_here
```

- **Descrição**: Senha de aplicativo do Gmail para envio de e-mails
- **Obrigatório**: Sim (se usar Gmail)
- **Como gerar**: 
  1. Acesse https://myaccount.google.com/apppasswords
  2. Gere uma senha de aplicativo
  3. Use essa senha aqui (não a senha normal da conta)

### Configurações do Keycloak Admin

```bash
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=your_keycloak_admin_password_here
```

- **Descrição**: Credenciais do administrador do Keycloak para operações administrativas
- **Obrigatório**: Sim (para operações administrativas)
- **Nota**: Em produção, considere usar client-secret ao invés de username/password

### Configurações do Google Maps

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

- **Descrição**: Chave da API do Google Maps
- **Obrigatório**: Sim (se usar funcionalidades do Google Maps)
- **Como obter**: 
  1. Acesse https://console.cloud.google.com/google/maps-apis
  2. Crie um projeto ou selecione um existente
  3. Habilite as APIs necessárias (Maps JavaScript API, Geocoding API)
  4. Crie uma chave de API

## Exemplo de Arquivo .env

```bash
# Banco de Dados
DB_PASSWORD=sua_senha_aqui

# Superfrete
SUPERFRETE_TOKEN_DEV=token_dev_aqui
SUPERFRETE_TOKEN_PROD=token_prod_aqui

# Gmail
GMAIL_PASSWORD=senha_app_gmail_aqui

# Keycloak
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=senha_admin_aqui

# Google Maps
GOOGLE_MAPS_API_KEY=chave_api_aqui
```

## Configuração no Quarkus

O Quarkus lê variáveis de ambiente automaticamente. Você pode:

1. **Definir no sistema**: Configure as variáveis no seu sistema operacional
2. **Usar arquivo .env**: Coloque um arquivo `.env` na raiz do projeto `xfa-api`
3. **Usar application.properties**: As variáveis já estão configuradas com valores padrão vazios (usando `${VAR:}`)

## Produção

Em produção, **NUNCA** use arquivos `.env`. Use:

- **Podman Secrets**: Para containers Podman
- **Kubernetes Secrets**: Para Kubernetes
- **Variáveis de ambiente do sistema**: Configuradas no servidor
- **Gerenciadores de secrets**: HashiCorp Vault, AWS Secrets Manager, etc.

## Segurança

⚠️ **IMPORTANTE**:

1. **NUNCA** commite credenciais no repositório
2. **Rotacione** todas as credenciais regularmente
3. **Use diferentes credenciais** para desenvolvimento e produção
4. **Monitore** o uso das credenciais
5. **Revogue** credenciais comprometidas imediatamente

## Troubleshooting

Se a aplicação não encontrar as variáveis de ambiente:

1. Verifique se o arquivo `.env` está na raiz do projeto `xfa-api`
2. Verifique se as variáveis estão definidas no sistema
3. Verifique os logs da aplicação para erros de configuração
4. Certifique-se de que o `.env` não está no `.gitignore` (mas os valores reais não devem ser commitados)
