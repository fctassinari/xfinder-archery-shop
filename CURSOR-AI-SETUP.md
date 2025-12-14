# Guia de Configuração do Cursor AI para X-Finder Archery Shop

Este guia fornece instruções completas para configurar o Cursor AI e obter o melhor desempenho no desenvolvimento do projeto.

## 📋 Índice
1. [Arquivos de Configuração Criados](#arquivos-de-configuração-criados)
2. [Configurações do Cursor AI](#configurações-do-cursor-ai)
3. [Dicas de Uso para Melhor Desempenho](#dicas-de-uso-para-melhor-desempenho)
4. [Comandos Úteis](#comandos-úteis)
5. [Troubleshooting](#troubleshooting)

---

## 📁 Arquivos de Configuração Criados

### 1. `.cursorrules`
Arquivo que define regras e contexto específico do projeto para o Cursor AI. Ele contém:
- Contexto sobre a arquitetura do projeto
- Padrões de código para Java/Quarkus e React/TypeScript
- Convenções de nomenclatura
- Boas práticas de segurança e performance
- Instrução para sempre responder em Português

### 2. `.cursorignore`
Arquivo que especifica quais arquivos e diretórios devem ser ignorados pelo índice do Cursor AI. Isso melhora:
- **Performance**: Reduz o tamanho do índice
- **Relevância**: Foca em código fonte, não em arquivos gerados
- **Velocidade**: Respostas mais rápidas

---

## ⚙️ Configurações do Cursor AI

### Configurações Recomendadas no Cursor

1. **Abrir Configurações**:
   - Pressione `Ctrl+,` (Windows/Linux) ou `Cmd+,` (Mac)
   - Ou vá em `File > Preferences > Settings`

2. **Configurações Importantes**:

   #### Editor
   - ✅ Habilitar "Format On Save"
   - ✅ Habilitar "Auto Save" (após delay)
   - ✅ Configurar "Tab Size" para 2 (frontend) e 4 (backend)

   #### Cursor AI
   - ✅ Habilitar "Indexing" (já está ativo por padrão)
   - ✅ Configurar "Max Tokens" para 4096 ou mais (se disponível)
   - ✅ Habilitar "Code Completion"
   - ✅ Habilitar "Inline Suggestions"

   #### TypeScript/JavaScript
   - ✅ Habilitar "TypeScript: Prefer Project References"
   - ✅ Habilitar "JavaScript: Suggest Enabled"

   #### Java
   - ✅ Configurar "Java: Home" (se necessário)
   - ✅ Habilitar "Java: Format Enabled"

### Configurações via settings.json

Crie o arquivo `.vscode/settings.json` na raiz do projeto manualmente (o diretório `.vscode` pode estar no `.gitignore`, mas você pode criar o arquivo):

**Passos**:
1. Crie o diretório `.vscode` na raiz do projeto (se não existir)
2. Crie o arquivo `settings.json` dentro de `.vscode/`
3. Cole o conteúdo abaixo:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[java]": {
    "editor.tabSize": 4,
    "editor.formatOnSave": true
  },
  "typescript.tsdk": "xfa-web/node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/target": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/target": true,
    "**/dist": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/target/**": true,
    "**/dist/**": true
  }
}
```

**Nota**: Se o diretório `.vscode` estiver no `.gitignore`, você ainda pode criar o arquivo localmente. Ele será ignorado pelo git, mas funcionará no seu ambiente.

**Template disponível**: Existe um arquivo `.vscode-settings-template.json` na raiz do projeto que você pode copiar para `.vscode/settings.json`.

---

## 🚀 Dicas de Uso para Melhor Desempenho

### 1. **Use Comandos Específicos**
Em vez de pedidos genéricos, seja específico:

❌ **Ruim**: "Corrige o código"
✅ **Bom**: "Adicione validação de email no formulário de contato usando Zod"

### 2. **Forneça Contexto**
Mencione o arquivo ou módulo específico:

✅ "No arquivo `CustomerService.java`, adicione um método para buscar cliente por email"

### 3. **Use o Chat para Perguntas Complexas**
- Para refatorações grandes
- Para entender arquitetura
- Para debugar problemas complexos

### 4. **Use Inline Suggestions para Código Simples**
- O Cursor sugere automaticamente enquanto você digita
- Aceite sugestões com `Tab` ou `Ctrl+→`

### 5. **Use Codebase Search**
- Pressione `Ctrl+K` para buscar no código
- Use para encontrar exemplos de implementação similar

### 6. **Organize o Workspace**
- Abra apenas os diretórios necessários
- Feche arquivos não utilizados
- Use workspaces separados para frontend e backend se preferir

### 7. **Atualize o Índice Regularmente**
- O Cursor indexa automaticamente
- Se mudanças grandes foram feitas, pode ser útil reiniciar o Cursor

---

## 💡 Comandos Úteis

### Atalhos de Teclado do Cursor

| Ação | Atalho (Windows/Linux) | Atalho (Mac) |
|------|------------------------|--------------|
| Abrir Chat | `Ctrl+L` | `Cmd+L` |
| Completar Código | `Tab` | `Tab` |
| Aceitar Sugestão | `Ctrl+→` | `Cmd+→` |
| Rejeitar Sugestão | `Esc` | `Esc` |
| Buscar no Código | `Ctrl+K` | `Cmd+K` |
| Editar com AI | `Ctrl+K` (selecionar código) | `Cmd+K` (selecionar código) |

### Comandos de Chat Úteis

```
# Exemplos de comandos eficientes:

"Explique como funciona o ProductService.java"
"Crie um componente React para exibir produtos em grid"
"Adicione validação de estoque no OrderService"
"Refatore o componente Cart.tsx para usar React Query"
"Gere testes unitários para CustomerResource.java"
```

---

## 🔧 Troubleshooting

### Problema: Cursor não está indexando arquivos
**Solução**:
1. Verifique se `.cursorignore` não está excluindo arquivos importantes
2. Reinicie o Cursor
3. Verifique se há espaço em disco suficiente

### Problema: Sugestões lentas ou imprecisas
**Solução**:
1. Feche arquivos não utilizados
2. Verifique se `node_modules` e `target` estão no `.cursorignore`
3. Reduza o número de arquivos abertos simultaneamente

### Problema: Cursor não entende o contexto do projeto
**Solução**:
1. Verifique se `.cursorrules` está na raiz do projeto
2. Certifique-se de que o arquivo está bem formatado
3. Reinicie o Cursor após criar/editar `.cursorrules`

### Problema: Sugestões incorretas para TypeScript
**Solução**:
1. Verifique se `tsconfig.json` está configurado corretamente
2. Execute `npm install` no diretório `xfa-web`
3. Verifique se o TypeScript está instalado: `npm list typescript`

### Problema: Cursor não reconhece imports do projeto
**Solução**:
1. Verifique os `paths` no `tsconfig.json`
2. Certifique-se de que os aliases estão configurados corretamente
3. Reinicie o servidor TypeScript: `Ctrl+Shift+P` > "TypeScript: Restart TS Server"

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Cursor AI Documentation](https://cursor.sh/docs)
- [Cursor AI Best Practices](https://cursor.sh/docs/best-practices)

### Projeto Específico
- `README.md` - Documentação principal
- `xfa-api/README-Api.md` - Documentação da API
- `xfa-web/README-Web.md` - Documentação do Frontend

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.cursorrules` criado e revisado
- [ ] Arquivo `.cursorignore` criado e ajustado conforme necessário
- [ ] Configurações do Cursor ajustadas
- [ ] TypeScript configurado corretamente
- [ ] Java/Quarkus configurado (se usando extensões Java)
- [ ] Testado comandos básicos do Cursor
- [ ] Workspace organizado

---

## 🎯 Próximos Passos

1. **Teste o Cursor**: Faça algumas perguntas sobre o projeto
2. **Ajuste as Regras**: Edite `.cursorrules` conforme necessário
3. **Otimize o Ignore**: Ajuste `.cursorignore` se notar arquivos desnecessários sendo indexados
4. **Explore Recursos**: Experimente diferentes funcionalidades do Cursor

---

**Última atualização**: Criado para o projeto X-Finder Archery Shop
**Versão do Cursor**: Compatível com versões recentes

