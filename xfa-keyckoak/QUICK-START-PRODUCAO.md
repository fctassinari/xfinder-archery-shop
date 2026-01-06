# Quick Start - Keycloak em Produção

## Resumo Rápido

### 1. Build da Imagem
```bash
cd xfa-keyckoak
podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
```

### 2. Iniciar Keycloak
```bash
# Linux/Mac
./start-producao.sh

# Windows PowerShell
.\start-producao.ps1
```

### 3. Configurar Nginx

**Opção A - Adicionar ao arquivo existente:**

Adicione as locations do arquivo `nginx-keycloak.conf` dentro do bloco `server` existente que já tem SSL.

**Opção B - Usar configuração completa:**

Substitua o conteúdo do arquivo de configuração do nginx pelo conteúdo de `nginx-keycloak-completo.conf`.

**Importante:** Ajuste o upstream conforme necessário:
- Mesmo servidor: `server localhost:8084;`
- Servidor remoto: `server vpsking15907.publiccloud.com.br:8084;`

### 4. Recarregar Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Acessar
- Admin Console: `https://xfinder-archery.com.br/admin`
- Realm: `https://xfinder-archery.com.br/realms/xfinder`

## Principais Diferenças

| Item | Desenvolvimento | Produção |
|------|----------------|----------|
| Dockerfile | `Dockerfile` | `Dockerfile.prod` |
| Porta | 8443 (HTTPS) | 8084 (HTTP) |
| Certificado | Auto-assinado | Nginx (Let's Encrypt) |
| Proxy | Não | Sim (edge) |
| Hostname | localhost | xfinder-archery.com.br |

## Documentação Completa

Veja [README-PRODUCAO.md](README-PRODUCAO.md) para detalhes completos.
