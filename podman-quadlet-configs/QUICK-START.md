# Quick Start - Podman Quadlet X-Finder

Guia rápido para configurar o Podman Quadlet no servidor de produção.

## Pré-requisitos

- Rocky Linux 9.7 (ou similar)
- Podman 4.x ou superior
- Acesso root/sudo
- Imagens Docker construídas e disponíveis

## Instalação Rápida

### 1. Copiar arquivos para o servidor

```bash
# No servidor de produção
sudo mkdir -p /etc/containers/systemd
sudo cp podman-quadlet-configs/*.container /etc/containers/systemd/
sudo cp podman-quadlet-configs/*.network /etc/containers/systemd/
```

**Ou usar o script de instalação:**

```bash
cd podman-quadlet-configs
sudo bash install-quadlet.sh
```

### 2. Verificar arquivos copiados

```bash
# Verificar se os arquivos estão no local correto
ls -la /etc/containers/systemd/*.container
ls -la /etc/containers/systemd/*.network

# Ajustar permissões (se necessário)
sudo chmod 644 /etc/containers/systemd/*.container
sudo chmod 644 /etc/containers/systemd/*.network
```

### 3. Recarregar systemd

**IMPORTANTE**: Execute este comando ANTES de tentar habilitar os serviços.

```bash
sudo systemctl daemon-reload

# Verificar se os serviços foram reconhecidos
sudo systemctl list-unit-files | grep xfinder
```

### 4. Habilitar serviços

```bash
sudo systemctl enable xfinder-postgres.service
sudo systemctl enable xfinder-keycloak.service
sudo systemctl enable xfinder-api.service
sudo systemctl enable xfinder-web.service
```

### 5. Iniciar serviços

```bash
# PostgreSQL primeiro
sudo systemctl start xfinder-postgres.service
sleep 15

# Criar bancos de dados (apenas primeira vez)
sudo podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
sudo podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"

# Keycloak
sudo systemctl start xfinder-keycloak.service
sleep 30

# API
sudo systemctl start xfinder-api.service
sleep 10

# Frontend
sudo systemctl start xfinder-web.service
```

### 6. Verificar status

```bash
# Usar o script de verificação
bash podman-quadlet-configs/check-status.sh

# Ou manualmente
sudo systemctl status xfinder-postgres.service xfinder-keycloak.service xfinder-api.service xfinder-web.service
```

## Comandos Essenciais

### Ver logs

```bash
# Logs em tempo real de todos os serviços
sudo journalctl -u xfinder-postgres.service -u xfinder-keycloak.service -u xfinder-api.service -u xfinder-web.service -f

# Logs de um serviço específico
sudo journalctl -u xfinder-api.service -f
```

### Gerenciar serviços

```bash
# Parar
sudo systemctl stop xfinder-api.service

# Iniciar
sudo systemctl start xfinder-api.service

# Reiniciar
sudo systemctl restart xfinder-api.service

# Status
sudo systemctl status xfinder-api.service
```

### Ver containers

```bash
# Listar containers em execução
podman ps

# Ver logs de um container
podman logs xfinder-api
```

## Troubleshooting Rápido

### Erro "Unit is transient or generated"

Se receber este erro ao tentar `systemctl enable`:

```bash
# 1. Verificar localização dos arquivos
ls -la /etc/containers/systemd/*.container

# 2. Parar serviços temporários
sudo systemctl stop xfinder-*.service 2>/dev/null || true
sudo systemctl daemon-reload
sudo systemctl reset-failed

# 3. Recarregar e tentar novamente
sudo systemctl daemon-reload
sudo systemctl enable xfinder-postgres.service
```

### Serviço não inicia

```bash
# Ver logs detalhados
sudo journalctl -xeu xfinder-api.service

# Verificar se a imagem existe
podman images | grep xfinder-api
```

### Rede não funciona

```bash
# Verificar rede
podman network inspect nt-xfinder

# Recriar rede
sudo podman network rm nt-xfinder
sudo systemctl daemon-reload
sudo systemctl start xfinder-postgres.service
```

### Porta em uso

```bash
# Verificar portas
sudo ss -tulpn | grep -E '5432|8083|8084|8085'
```

## Próximos Passos

1. Configurar backup automático dos volumes
2. Configurar Podman Secrets para senhas (veja `EXEMPLO-PODMAN-SECRETS.md`)
3. Configurar monitoramento e alertas
4. Revisar logs regularmente

## Documentação Completa

Para mais detalhes, consulte:
- `README-PODMAN-QUADLET-XFINDER.md` - Documentação completa
- `EXEMPLO-PODMAN-SECRETS.md` - Como usar Podman Secrets
- `README.md` (no diretório podman-quadlet-configs) - Informações sobre os arquivos
