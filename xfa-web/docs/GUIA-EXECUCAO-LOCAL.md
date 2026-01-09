# Guia de Execução Local - Frontend React (Windows 11)

Este guia mostra como executar o frontend React localmente no Windows 11, usando as mesmas configurações do Dockerfile.

## Pré-requisitos

1. **Node.js 22** (ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique a instalação:
     ```powershell
     node --version
     npm --version
     ```

2. **Git** (opcional, se ainda não tiver)
   - Baixe em: https://git-scm.com/download/win

## Passo a Passo

### Opção Rápida: Script Automatizado

Execute o script de setup que configura tudo automaticamente:

**Opção A - Script Bash (Recomendado - funciona no Git Bash e WSL):**

```bash
cd C:\Users\integ\Downloads\dev\git\xfinder-archery-shop\xfa-web
bash setup-local.sh
```

**Opção B - Script PowerShell (requer permissão de execução):**

```powershell
cd C:\Users\integ\Downloads\dev\git\xfinder-archery-shop\xfa-web
.\setup-local.ps1
```

**Nota**: Se o PowerShell mostrar erro de política de execução, use o script bash ou execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

O script irá:
- Verificar se Node.js e npm estão instalados
- Criar o arquivo `.env` com as configurações corretas
- Instalar todas as dependências

Depois, pule para o **Passo 3** (Executar o servidor).

---

### Opção Manual: Passo a Passo

### 1. Navegar até o diretório do frontend

Abra o PowerShell ou Terminal e navegue até o diretório do projeto:

```powershell
cd C:\Users\integ\Downloads\dev\git\xfinder-archery-shop\xfa-web
```

### 2. Instalar dependências

Execute o comando para instalar todas as dependências do projeto:

```powershell
npm install --legacy-peer-deps
```

**Tempo estimado**: 2-5 minutos (dependendo da velocidade da internet)

**Nota**: A flag `--legacy-peer-deps` é necessária devido a algumas incompatibilidades de versão entre pacotes.

### 3. Executar o servidor de desenvolvimento

Execute o comando para iniciar o servidor de desenvolvimento:

```powershell
npm run dev
```

O servidor Vite será iniciado e você verá uma saída similar a:

```
  VITE v5.4.1  ready in 1234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://[::]:8080/
  ➜  press h + enter to show help
```

### 5. Acessar a aplicação

Abra seu navegador e acesse:

```
http://localhost:8080
```

A aplicação estará rodando localmente com hot-reload habilitado (mudanças no código são refletidas automaticamente).

## Comandos Úteis

### Parar o servidor
Pressione `Ctrl + C` no terminal onde o servidor está rodando.

### Build para produção
Para gerar uma build de produção (como no Dockerfile):

```powershell
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Preview da build de produção
Para testar a build de produção localmente:

```powershell
npm run preview
```

### Limpar cache e reinstalar
Se encontrar problemas com dependências:

```powershell
# Remover node_modules e package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstalar
npm install --legacy-peer-deps
```

## Variáveis de Ambiente

As variáveis de ambiente são carregadas automaticamente do arquivo `.env` quando você executa `npm run dev` ou `npm run build`.

### Variáveis Configuradas (baseadas no Dockerfile)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8081` | URL da API backend |
| `VITE_KEYCLOAK_URL` | `https://localhost:8443` | URL do servidor Keycloak |
| `VITE_KEYCLOAK_REALM` | `xfinder` | Realm do Keycloak |
| `VITE_KEYCLOAK_CLIENT_ID` | `xfinder-web` | Client ID do Keycloak |
| `VITE_APP_BASE_URL` | `http://localhost:8080` | URL base do frontend |

### Alterar Variáveis de Ambiente

1. Edite o arquivo `.env` na raiz de `xfa-web`
2. Reinicie o servidor de desenvolvimento (`Ctrl + C` e depois `npm run dev`)

**Importante**: No Vite, variáveis de ambiente são injetadas em tempo de build. Para mudanças no `.env`, é necessário reiniciar o servidor.

## Troubleshooting

### Erro de política de execução do PowerShell

Se você receber o erro:
```
.\setup-local.ps1 : O arquivo ... não pode ser carregado porque a execução de scripts foi desabilitada
```

**Solução 1 - Usar o script Bash (Recomendado):**
```bash
bash setup-local.sh
```

**Solução 2 - Habilitar execução de scripts no PowerShell:**
```powershell
# Abra o PowerShell como Administrador e execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solução 3 - Executar com bypass temporário:**
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-local.ps1
```

### Porta 8080 já está em uso

Se a porta 8080 estiver ocupada, você pode:

1. **Encontrar o processo usando a porta**:
   ```powershell
   netstat -ano | findstr :8080
   ```

2. **Finalizar o processo** (substitua `PID` pelo número do processo):
   ```powershell
   taskkill /PID <PID> /F
   ```

3. **Ou alterar a porta no `vite.config.ts`**:
   ```typescript
   server: {
     port: 3000, // ou outra porta disponível
   }
   ```

### Erro de dependências

Se houver erros relacionados a dependências:

```powershell
# Limpar cache do npm
npm cache clean --force

# Remover node_modules
Remove-Item -Recurse -Force node_modules

# Reinstalar
npm install --legacy-peer-deps
```

### Erro de certificado SSL (Keycloak)

Se você estiver usando Keycloak com HTTPS local (`https://localhost:8443`), pode ser necessário:

1. Aceitar o certificado auto-assinado no navegador
2. Ou configurar o Keycloak para usar HTTP em desenvolvimento

### Problemas com hot-reload

Se as mudanças não estiverem sendo refletidas:

1. Salve o arquivo novamente
2. Verifique o console do navegador (F12) para erros
3. Reinicie o servidor de desenvolvimento

## Estrutura de Arquivos

```
xfa-web/
├── .env                    # Variáveis de ambiente (criado)
├── package.json            # Dependências e scripts
├── vite.config.ts          # Configuração do Vite
├── src/                    # Código fonte
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços de API
│   └── ...
└── dist/                   # Build de produção (gerado)
```

## Próximos Passos

1. Certifique-se de que a **API backend** está rodando em `http://localhost:8081`
2. Certifique-se de que o **Keycloak** está rodando em `https://localhost:8443`
3. Acesse `http://localhost:8080` no navegador
4. Comece a desenvolver! 🚀

## Diferenças entre Docker e Local

| Aspecto | Docker | Local |
|---------|--------|-------|
| **Build** | Multi-stage build com nginx | Servidor de desenvolvimento Vite |
| **Servidor** | Nginx (produção) | Vite dev server (desenvolvimento) |
| **Hot Reload** | Não (precisa rebuild) | Sim (automático) |
| **Porta** | 8080 | 8080 (configurável) |
| **Variáveis** | ARG/ENV no Dockerfile | Arquivo `.env` |

## Referências

- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do React](https://react.dev/)
- [Documentação do Keycloak](https://www.keycloak.org/documentation)

