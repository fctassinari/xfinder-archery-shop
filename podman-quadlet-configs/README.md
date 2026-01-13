# Arquivos de Configuração Podman Quadlet - X-Finder Archery Shop

Este diretório contém os arquivos de configuração do Podman Quadlet para o projeto X-Finder Archery Shop.

## Como Usar

### 1. Copiar arquivos para o servidor

Copie todos os arquivos deste diretório para `/etc/containers/systemd/` no servidor de produção:

```bash
# No servidor de produção
sudo cp podman-quadlet-configs/*.container /etc/containers/systemd/
sudo cp podman-quadlet-configs/*.network /etc/containers/systemd/
```

### 2. Ajustar configurações (se necessário)

Antes de usar, verifique e ajuste:

- **Imagens Docker**: Certifique-se de que as imagens referenciadas existem:
  - `docker.io/library/postgres:18.0`
  - `docker.io/fctassinari/xfinder-keycloak:prod`
  - `docker.io/fctassinari/xfinder-api:latest`
  - `docker.io/fctassinari/xfinder-web:latest`

- **Senhas**: Considere usar Podman Secrets ao invés de variáveis de ambiente para maior segurança (veja o README principal)

- **Subnet da rede**: A subnet `10.90.0.0/24` pode precisar ser ajustada se houver conflito com outras redes

### 3. Recarregar systemd

```bash
sudo systemctl daemon-reload
```

### 4. Habilitar e iniciar serviços

Siga as instruções no `README-PODMAN-QUADLET-XFINDER.md` para habilitar e iniciar os serviços.

## Estrutura de Arquivos

### Arquivos de Configuração
- `nt-xfinder.network` - Configuração da rede Docker
- `xfinder-postgres.container` - Container do PostgreSQL
- `xfinder-keycloak.container` - Container do Keycloak
- `xfinder-api.container` - Container da API Backend
- `xfinder-web.container` - Container do Frontend Web

### Scripts Auxiliares
- `install-quadlet.sh` - Script de instalação automática
- `start-services.sh` - Script para iniciar todos os serviços na ordem correta
- `verify-keycloak.sh` - Script para diagnosticar problemas com o serviço Keycloak
- `check-status.sh` - Script para verificar status dos serviços

## Solução de Problemas

### Erro "Unit is transient or generated"

**Este erro é normal e esperado!** Com Podman Quadlet, não use `systemctl enable` para unidades geradas.

**Solução**: Apenas inicie os serviços diretamente:

```bash
# Opção 1: Usar o script auxiliar (recomendado)
sudo bash start-services.sh

# Opção 2: Iniciar manualmente
sudo systemctl daemon-reload
sudo systemctl start xfinder-postgres.service
sudo systemctl start xfinder-keycloak.service
sudo systemctl start xfinder-api.service
sudo systemctl start xfinder-web.service
```

Os serviços iniciarão automaticamente no boot porque a seção `[Install]` está configurada nos arquivos `.container`.

Para mais detalhes, veja `README-PODMAN-QUADLET-XFINDER.md` na seção "Troubleshooting".

## Notas Importantes

1. **Ordem de inicialização**: As dependências estão configuradas nas seções `[Unit]` com `After=` e `Requires=`

2. **Volumes**: Os volumes serão criados automaticamente pelo Podman se não existirem

3. **Portas**: Certifique-se de que as portas não estão em uso:
   - 5432 (PostgreSQL)
   - 8083 (Frontend Web)
   - 8084 (Keycloak)
   - 8085 (API Backend)

4. **Bancos de dados**: Após a primeira inicialização do PostgreSQL, será necessário criar os bancos `xfa` e `keycloak` manualmente

5. **daemon-reload**: Sempre execute `sudo systemctl daemon-reload` ANTES de tentar habilitar os serviços

## Segurança

⚠️ **ATENÇÃO**: Os arquivos contêm senhas em texto plano. Para produção, considere:

1. Usar Podman Secrets (recomendado)
2. Restringir permissões dos arquivos: `sudo chmod 600 /etc/containers/systemd/*.container`
3. Usar um gerenciador de secrets como HashiCorp Vault

Veja a seção "Segurança" no `README-PODMAN-QUADLET-XFINDER.md` para mais detalhes.
