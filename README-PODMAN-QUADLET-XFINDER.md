# Roteiro de Configuração Podman Quadlet - X-Finder Archery Shop

## Visão Geral

Este roteiro detalha a configuração do Podman Quadlet para o projeto X-Finder Archery Shop em ambiente de produção (Rocky Linux 9.7). O Quadlet permite gerenciar containers como serviços systemd, garantindo inicialização automática no boot e gerenciamento de dependências.

## Arquitetura do Sistema

O projeto consiste em 4 serviços principais:

1. **PostgreSQL** (xfinder-postgres) - Banco de dados
2. **Keycloak** (xfinder-keycloak) - Servidor de autenticação
3. **API Backend** (xfinder-api) - API Quarkus/Java
4. **Frontend Web** (xfinder-web) - Aplicação React/Nginx

### Estrutura de Dependências

```
nt-xfinder.network (rede base)
    ↓
xfinder-postgres.service (banco de dados)
    ↓
    ├─→ xfinder-keycloak.service
    │
    └─→ xfinder-api.service
            ↓
        xfinder-web.service
```

## Passo a Passo de Configuração

### 1. Preparação do Ambiente

#### 1.1 Criar diretório para arquivos Quadlet

```bash
sudo mkdir -p /etc/containers/systemd
```

#### 1.2 Verificar imagens Docker disponíveis

Antes de criar os arquivos Quadlet, certifique-se de que as imagens Docker estão disponíveis:

- `postgres:18.0` (imagem oficial)
- `xfinder-keycloak:prod` (imagem customizada - precisa ser construída)
- `xfinder-api:latest` (imagem customizada - precisa ser construída)
- `xfinder-web:latest` (imagem customizada - precisa ser construída)

### 2. Criar Network como Serviço

Criar arquivo de rede `nt-xfinder.network`:

```bash
sudo vim /etc/containers/systemd/nt-xfinder.network
```

Conteúdo:

```ini
[Network]
NetworkName=nt-xfinder
Driver=bridge
Subnet=10.90.0.0/24
Gateway=10.90.0.1
```

**Ou copiar do template**: Os arquivos de configuração estão disponíveis no diretório `podman-quadlet-configs/` deste projeto. Você pode copiá-los para o servidor:

```bash
# No servidor de produção
sudo cp podman-quadlet-configs/nt-xfinder.network /etc/containers/systemd/
```

### 3. Criar Arquivos .container para Cada Serviço

#### 3.1 PostgreSQL (xfinder-postgres.container)

```bash
sudo vim /etc/containers/systemd/xfinder-postgres.container
```

**Ou copiar do template**:

```bash
sudo cp podman-quadlet-configs/xfinder-postgres.container /etc/containers/systemd/
```

Conteúdo completo está disponível em `podman-quadlet-configs/xfinder-postgres.container`.

**Nota**: Após a primeira inicialização, será necessário criar os bancos de dados `xfa` e `keycloak` manualmente.

#### 3.2 Keycloak (xfinder-keycloak.container)

```bash
sudo vim /etc/containers/systemd/xfinder-keycloak.container
```

**Ou copiar do template**:

```bash
sudo cp podman-quadlet-configs/xfinder-keycloak.container /etc/containers/systemd/
```

#### 3.3 API Backend (xfinder-api.container)

```bash
sudo vim /etc/containers/systemd/xfinder-api.container
```

**Ou copiar do template**:

```bash
sudo cp podman-quadlet-configs/xfinder-api.container /etc/containers/systemd/
```

**Nota**: A API usa o perfil `prod` que está configurado no `application.properties` para conectar ao PostgreSQL e Keycloak via hostnames da rede Docker.

#### 3.4 Frontend Web (xfinder-web.container)

```bash
sudo vim /etc/containers/systemd/xfinder-web.container
```

**Ou copiar do template**:

```bash
sudo cp podman-quadlet-configs/xfinder-web.container /etc/containers/systemd/
```

**Nota**: O frontend precisa ser construído com as variáveis de ambiente VITE_* corretas para produção. Essas variáveis são definidas no build-time, não no runtime.

### 4. Parar Containers e Serviços Existentes (se houver)

```bash
# Parar serviços systemd (se existirem)
sudo systemctl stop xfinder-postgres.service 2>/dev/null || true
sudo systemctl stop xfinder-keycloak.service 2>/dev/null || true
sudo systemctl stop xfinder-api.service 2>/dev/null || true
sudo systemctl stop xfinder-web.service 2>/dev/null || true

# Desabilitar serviços (se estiverem habilitados)
sudo systemctl disable xfinder-postgres.service 2>/dev/null || true
sudo systemctl disable xfinder-keycloak.service 2>/dev/null || true
sudo systemctl disable xfinder-api.service 2>/dev/null || true
sudo systemctl disable xfinder-web.service 2>/dev/null || true

# Parar containers Podman diretamente (se existirem)
sudo podman stop xfinder-postgres xfinder-keycloak-prod xfinder-keycloak xfinder-api xfinder-web 2>/dev/null || true
sudo podman rm xfinder-postgres xfinder-keycloak-prod xfinder-keycloak xfinder-api xfinder-web 2>/dev/null || true

# Limpar unidades systemd geradas
sudo systemctl daemon-reload
sudo systemctl reset-failed
```

### 5. Recarregar Systemd e Iniciar Serviços

**IMPORTANTE**: Execute `daemon-reload` ANTES de tentar habilitar os serviços.

```bash
# 1. Verificar se os arquivos estão no local correto
ls -la /etc/containers/systemd/*.container
ls -la /etc/containers/systemd/*.network

# 2. Recarregar configurações do systemd (CRÍTICO - deve ser feito primeiro)
sudo systemctl daemon-reload

# 3. Verificar se os serviços foram reconhecidos
sudo systemctl list-unit-files | grep xfinder

# 4. Habilitar para iniciar no boot
sudo systemctl enable xfinder-postgres.service
sudo systemctl enable xfinder-keycloak.service
sudo systemctl enable xfinder-api.service
sudo systemctl enable xfinder-web.service

# Iniciar os serviços na ordem correta
sudo systemctl start xfinder-postgres.service
sleep 15  # Aguardar PostgreSQL inicializar

# Criar bancos de dados (executar apenas na primeira vez)
sudo podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
sudo podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"

# Iniciar Keycloak
sudo systemctl start xfinder-keycloak.service
sleep 30  # Aguardar Keycloak inicializar

# Iniciar API
sudo systemctl start xfinder-api.service
sleep 10  # Aguardar API inicializar

# Iniciar Frontend
sudo systemctl start xfinder-web.service
```

### 6. Verificar Status dos Serviços

```bash
# Ver status de todos os serviços
sudo systemctl status xfinder-postgres.service xfinder-keycloak.service xfinder-api.service xfinder-web.service

# Ver logs em tempo real
sudo journalctl -u xfinder-postgres.service -u xfinder-keycloak.service -u xfinder-api.service -u xfinder-web.service -f

# Ver containers em execução
podman ps
```

## Comandos Úteis para Gerenciamento

### Ver Logs

```bash
# Logs de um serviço específico
sudo journalctl -u xfinder-api.service -f

# Logs com limite de linhas
sudo journalctl -u xfinder-keycloak.service -n 100

# Logs desde uma data específica
sudo journalctl -u xfinder-api.service --since "2025-01-20"
```

### Gerenciar Serviços

```bash
# Parar um serviço
sudo systemctl stop xfinder-api.service

# Reiniciar um serviço
sudo systemctl restart xfinder-keycloak.service

# Desabilitar inicialização automática
sudo systemctl disable xfinder-web.service

# Habilitar inicialização automática
sudo systemctl enable xfinder-web.service
```

### Verificar Rede e Containers

```bash
# Listar redes
sudo podman network ls

# Inspecionar rede
sudo podman network inspect nt-xfinder

# Ver containers em execução
podman ps -a

# Ver logs de um container específico
podman logs xfinder-api
```

## Configurações Importantes

### Variáveis de Ambiente do Frontend

O frontend (`xfinder-web`) precisa ser construído com as seguintes variáveis de ambiente no build-time:

- `VITE_API_BASE_URL=https://xfinder-archery.com.br`
- `VITE_KEYCLOAK_URL=https://xfinder-archery.com.br`
- `VITE_KEYCLOAK_REALM=xfinder`
- `VITE_KEYCLOAK_CLIENT_ID=xfinder-web`
- `VITE_APP_BASE_URL=https://xfinder-archery.com.br`

Essas variáveis devem ser passadas durante o build da imagem Docker, não no runtime do container.

### Configuração da API

A API está configurada para usar o perfil `prod` que:

- Conecta ao PostgreSQL em `xfinder-postgres:5432`
- Conecta ao Keycloak em `https://xfinder-archery.com.br`
- Usa a porta `8085` em produção

### Configuração do Keycloak

O Keycloak está configurado para:

- Usar PostgreSQL como banco de dados
- Funcionar atrás de proxy reverso (nginx)
- Aceitar conexões HTTP na porta 8084 (SSL é tratado pelo nginx)
- Importar realm automaticamente do arquivo `realm-export-prod.json`

## Segurança

### Usando Podman Secrets (Recomendado)

Para melhorar a segurança, considere usar Podman Secrets para senhas:

```bash
# Criar secrets
echo -n "XFA@2025" | sudo podman secret create postgres_password -
echo -n "XFA@2025" | sudo podman secret create keycloak_admin_password -
echo -n "bpir kvyk osew qxkz" | sudo podman secret create smtp_password -
```

Depois, modifique os arquivos `.container` para usar secrets ao invés de variáveis de ambiente:

```ini
[Container]
Secret=postgres_password,type=env,target=POSTGRES_PASSWORD
# Remover: Environment=POSTGRES_PASSWORD=XFA@2025
```

## Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
sudo journalctl -xeu xfinder-api.service

# Verificar status
sudo systemctl status xfinder-api.service

# Testar manualmente
sudo podman run --rm -it docker.io/fctassinari/xfinder-api:latest /bin/bash
```

### Problemas com rede

```bash
# Verificar se a rede existe
sudo podman network inspect nt-xfinder

# Recriar rede se necessário
sudo podman network rm nt-xfinder
sudo systemctl daemon-reload
sudo systemctl start xfinder-postgres.service
```

### Portas já em uso

```bash
# Verificar portas em uso
sudo ss -tulpn | grep -E '5432|8083|8084|8085'

# Liberar porta (exemplo)
sudo systemctl stop serviço-conflitante
```

### Banco de dados não inicializa

```bash
# Verificar logs do PostgreSQL
sudo journalctl -u xfinder-postgres.service -f

# Verificar se os bancos foram criados
sudo podman exec -it xfinder-postgres psql -U postgres -l
```

### Erro "Unit is transient or generated"

Se você receber o erro `Failed to enable unit: Unit /run/systemd/generator/xfinder-postgres.service is transient or generated`:

```bash
# 1. Verificar se os arquivos estão no local correto
ls -la /etc/containers/systemd/*.container
ls -la /etc/containers/systemd/*.network

# 2. Parar qualquer serviço temporário que possa estar rodando
sudo systemctl stop xfinder-postgres.service 2>/dev/null || true
sudo systemctl stop xfinder-keycloak.service 2>/dev/null || true
sudo systemctl stop xfinder-api.service 2>/dev/null || true
sudo systemctl stop xfinder-web.service 2>/dev/null || true

# 3. Limpar unidades geradas temporariamente (se existirem)
sudo systemctl daemon-reload
sudo systemctl reset-failed

# 4. Verificar permissões dos arquivos
sudo chmod 644 /etc/containers/systemd/*.container
sudo chmod 644 /etc/containers/systemd/*.network

# 5. Recarregar novamente
sudo systemctl daemon-reload

# 6. Verificar se os serviços foram reconhecidos
sudo systemctl list-unit-files | grep xfinder

# 7. Agora tentar habilitar novamente
sudo systemctl enable xfinder-postgres.service
```

**Causas comuns deste erro:**
- Arquivos não estão em `/etc/containers/systemd/` (estão em outro local)
- `daemon-reload` não foi executado após copiar os arquivos
- Arquivos têm permissões incorretas
- Serviços temporários ainda estão ativos

## Backup e Restore

### Backup dos Volumes

```bash
# Backup de um volume específico
sudo podman volume export xfinder-postgres -o postgres-backup-$(date +%Y%m%d).tar

# Backup de todos os volumes
for vol in xfinder-postgres xfinder-keycloak-realm xfinder-web-logs; do
    sudo podman volume export $vol -o ${vol}-backup-$(date +%Y%m%d).tar 2>/dev/null || echo "Volume $vol não existe ou está vazio"
done
```

### Restore dos Volumes

```bash
# Restaurar um volume
sudo podman volume import xfinder-postgres postgres-backup-20250120.tar
```

## Atualizando Imagens

```bash
# Parar serviço
sudo systemctl stop xfinder-api.service

# Atualizar imagem (construir nova versão)
cd /caminho/para/xfinder-archery-shop/xfa-api
./mvnw package -DskipTests=true
sudo podman build -f src/main/docker/Dockerfile.jvm -t xfinder-api:latest .

# Reiniciar serviço
sudo systemctl start xfinder-api.service
```

## Checklist de Configuração

- [ ] Criar diretório `/etc/containers/systemd`
- [ ] Criar arquivo `nt-xfinder.network`
- [ ] Criar arquivo `xfinder-postgres.container`
- [ ] Criar arquivo `xfinder-keycloak.container`
- [ ] Criar arquivo `xfinder-api.container`
- [ ] Criar arquivo `xfinder-web.container`
- [ ] Construir imagens Docker customizadas (keycloak, api, web)
- [ ] Parar e remover containers antigos
- [ ] Executar `daemon-reload`
- [ ] Habilitar serviços com `enable`
- [ ] Iniciar PostgreSQL e criar bancos de dados
- [ ] Iniciar serviços na ordem correta
- [ ] Verificar status de todos os serviços
- [ ] Testar acesso às aplicações
- [ ] Configurar backup automático (opcional)
- [ ] Configurar Podman Secrets para senhas (opcional)

## Referências

- [Podman Quadlet Documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [Systemd Unit Files](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
- [Podman Network Configuration](https://docs.podman.io/en/latest/markdown/podman-network.1.html)
- [Guia de Referência (PsychoManager)](README-podman-quadlet-guide.md) - Exemplo de configuração similar

---

**Criado para**: X-Finder Archery Shop  
**Ambiente**: Rocky Linux 9.7  
**Podman Version**: 4.x+
