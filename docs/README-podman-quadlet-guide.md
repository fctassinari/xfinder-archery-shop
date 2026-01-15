# Guia de Configuração Podman Quadlet - Rocky Linux 9.7

## 📋 Passo a Passo para Configuração

### 1. Criar o diretório para os arquivos Quadlet

```bash
sudo mkdir -p /etc/containers/systemd
```

### 2. Criar a Network como serviço

Primeiro, vamos criar a rede `nt-psycho` como um arquivo `.network`:

```bash
sudo vim /etc/containers/systemd/nt-psycho.network
```

Cole o seguinte conteúdo:

```ini
[Network]
NetworkName=nt-psycho
Driver=bridge
Subnet=10.89.0.0/24
Gateway=10.89.0.1
```

### 3. Criar os arquivos .container para cada serviço

#### 3.1 MySQL (psycho-mysql.container)

```bash
sudo vim /etc/containers/systemd/psycho-mysql.container
```

```ini
[Unit]
Description=PsychoManager MySQL Database
After=network-online.target
Wants=network-online.target

[Container]
Image=docker.io/library/mysql:8.0.26
ContainerName=psycho-mysql
Network=nt-psycho.network
PublishPort=3306:3306
Volume=mysql:/var/lib/mysql
Environment=MYSQL_ROOT_PASSWORD=faka1609
Environment=MYSQL_DATABASE=psychomanager
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=900

[Install]
WantedBy=multi-user.target default.target
```

#### 3.2 Backend (psycho-backend.container)

```bash
sudo vim /etc/containers/systemd/psycho-backend.container
```

```ini
[Unit]
Description=PsychoManager Backend
After=network-online.target psycho-mysql.service
Wants=network-online.target
Requires=psycho-mysql.service

[Container]
Image=localhost/psychomanager:backend-3.0.5
ContainerName=psycho-backend
Network=nt-psycho.network
PublishPort=8080:8080
Volume=backend:/sistemasIIDH
Environment=JAVA_ENABLE_DEBUG=true
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target default.target
```

#### 3.3 Frontend (psycho-frontend.container)

```bash
sudo vim /etc/containers/systemd/psycho-frontend.container
```

```ini
[Unit]
Description=PsychoManager Frontend
After=network-online.target psycho-backend.service
Wants=network-online.target
Requires=psycho-backend.service

[Container]
Image=localhost/psychomanager:frontend-3.0.5
ContainerName=psycho-frontend
Network=nt-psycho.network
PublishPort=8081:8080
Volume=frontend:/sistemasIIDH
Environment=JAVA_ENABLE_DEBUG=true
Environment=http_proxy=
Environment=https_proxy=
Environment=HTTP_PROXY=
Environment=HTTPS_PROXY=
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target default.target
```

#### 3.4 WordPress (wordpress.container)

```bash
sudo vim /etc/containers/systemd/wordpress.container
```

```ini
[Unit]
Description=WordPress Site
After=network-online.target psycho-mysql.service
Wants=network-online.target
Requires=psycho-mysql.service

[Container]
Image=docker.io/library/wordpress:5.5
ContainerName=wordpress
Network=nt-psycho.network
PublishPort=8082:80
Volume=wordpress:/var/www/html
Environment=WORDPRESS_DB_HOST=psycho-mysql:3306
Environment=WORDPRESS_DB_USER=root
Environment=WORDPRESS_DB_PASSWORD=faka1609
Environment=WORDPRESS_DB_NAME=wordpress
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target default.target
```

#### 3.5 XFinder Web (xfinder-web.container)

```bash
sudo vim /etc/containers/systemd/xfinder-web.container
```

```ini
[Unit]
Description=XFinder Archery Website
After=network-online.target
Wants=network-online.target

[Container]
Image=localhost/xfinder-archery:commingsoon
ContainerName=xfinder-web
PublishPort=8083:80

[Service]
Restart=always
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target default.target
```

### 4. Parar os containers atuais

```bash
sudo podman stop psycho-mysql psycho-backend psycho-frontend wordpress xfinder-web
sudo podman rm psycho-mysql psycho-backend psycho-frontend wordpress xfinder-web
```

### 5. Recarregar o systemd e iniciar os serviços

```bash
# Recarregar configurações do systemd
sudo systemctl daemon-reload

# Habilitar para iniciar no boot
sudo systemctl enable psycho-mysql.service
sudo systemctl enable psycho-backend.service
sudo systemctl enable psycho-frontend.service
sudo systemctl enable wordpress.service
sudo systemctl enable xfinder-web.service

# Iniciar os serviços (MySQL primeiro, depois os outros)
sudo systemctl start psycho-mysql.service
sleep 10  # Aguardar MySQL inicializar
sudo systemctl start psycho-backend.service
sudo systemctl start psycho-frontend.service
sudo systemctl start wordpress.service
sudo systemctl start xfinder-web.service
```

### 6. Comandos úteis para gerenciar os serviços

```bash
# Ver status de todos os serviços
sudo systemctl status psycho-*.service wordpress.service xfinder-web.service

# Ver logs de um serviço específico
sudo journalctl -u psycho-mysql.service -f

# Parar um serviço
sudo systemctl stop psycho-backend.service

# Reiniciar um serviço
sudo systemctl restart psycho-frontend.service

# Ver containers em execução
podman ps

# Desabilitar inicialização automática
sudo systemctl disable psycho-mysql.service

# Ver logs com limite de linhas
sudo journalctl -u psycho-mysql.service -n 100

# Ver logs desde uma data específica
sudo journalctl -u psycho-backend.service --since "2025-12-20"

# Ver logs em tempo real de múltiplos serviços
sudo journalctl -u psycho-mysql.service -u psycho-backend.service -f
```

## 🎯 Vantagens do Quadlet

✅ **Dependências automáticas** - Backend só inicia após MySQL estar pronto  
✅ **Inicialização no boot** - Todos os containers sobem automaticamente  
✅ **Logs centralizados** - Use `journalctl` para ver logs  
✅ **Restart automático** - Containers reiniciam em caso de falha  
✅ **Gerenciamento systemd** - Use comandos familiares do systemd  
✅ **Integração nativa** - Melhor integração com o sistema operacional  

## 📊 Estrutura de Dependências

```
nt-psycho.network (rede base)
    ↓
psycho-mysql.service (banco de dados)
    ↓
    ├─→ psycho-backend.service
    │       ↓
    │   psycho-frontend.service
    │
    └─→ wordpress.service

xfinder-web.service (independente)
```

## ⚠️ Observações Importantes

1. **Ordem de inicialização** está garantida pelas diretivas `After=` e `Requires=`
2. **MySQL** terá 15 minutos para iniciar (TimeoutStartSec=900)
3. **Volumes nomeados** são preservados automaticamente
4. **Senhas em texto plano** - considere usar Podman secrets para maior segurança
5. **Network automática** - O Quadlet cria e gerencia a rede automaticamente
6. **Rocky Linux 9.7** - Compatível com Podman 4.x ou superior

## 🔒 Melhorando a Segurança (Opcional)

### Usando Podman Secrets para senhas

#### Criar secrets

```bash
# Criar secret para MySQL
echo -n "faka1609" | sudo podman secret create mysql_root_password -

# Criar secret para WordPress
echo -n "faka1609" | sudo podman secret create wordpress_db_password -
```

#### Modificar arquivo psycho-mysql.container

```ini
[Container]
Secret=mysql_root_password,type=env,target=MYSQL_ROOT_PASSWORD
# Remover linha: Environment=MYSQL_ROOT_PASSWORD=faka1609
```

#### Modificar arquivo wordpress.container

```ini
[Container]
Secret=wordpress_db_password,type=env,target=WORDPRESS_DB_PASSWORD
# Remover linha: Environment=WORDPRESS_DB_PASSWORD=faka1609
```

## 🔧 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
sudo journalctl -xeu psycho-mysql.service

# Verificar status
sudo systemctl status psycho-mysql.service

# Testar manualmente
sudo podman run --rm -it docker.io/library/mysql:8.0.26 /bin/bash
```

### Problemas com rede

```bash
# Listar redes
sudo podman network ls

# Inspecionar rede
sudo podman network inspect nt-psycho

# Recriar rede se necessário
sudo podman network rm nt-psycho
sudo systemctl daemon-reload
```

### Portas já em uso

```bash
# Verificar portas em uso
sudo ss -tulpn | grep -E '3306|8080|8081|8082|8083|5005|5006'

# Liberar porta (exemplo)
sudo systemctl stop serviço-conflitante
```

## 📝 Backup e Restore

### Backup dos volumes

```bash
# Criar backup de um volume
sudo podman volume export mysql -o mysql-backup.tar

# Backup de todos os volumes
for vol in mysql backend frontend wordpress; do
    sudo podman volume export $vol -o ${vol}-backup-$(date +%Y%m%d).tar
done
```

### Restore dos volumes

```bash
# Restaurar um volume
sudo podman volume import mysql mysql-backup.tar
```

## 🔄 Atualizando Imagens

```bash
# Parar serviço
sudo systemctl stop psycho-backend.service

# Atualizar imagem
sudo podman pull localhost/psychomanager:backend-3.0.5

# Reiniciar serviço
sudo systemctl start psycho-backend.service
```

## 📋 Checklist de Migração

- [ ] Criar diretório `/etc/containers/systemd`
- [ ] Criar arquivo `nt-psycho.network`
- [ ] Criar arquivo `psycho-mysql.container`
- [ ] Criar arquivo `psycho-backend.container`
- [ ] Criar arquivo `psycho-frontend.container`
- [ ] Criar arquivo `wordpress.container`
- [ ] Criar arquivo `xfinder-web.container`
- [ ] Parar e remover containers antigos
- [ ] Executar `daemon-reload`
- [ ] Habilitar serviços com `enable`
- [ ] Iniciar serviços na ordem correta
- [ ] Verificar status de todos os serviços
- [ ] Testar acesso às aplicações
- [ ] Configurar backup automático (opcional)

## 📚 Referências

- [Podman Quadlet Documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [Systemd Unit Files](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
- [Podman Network Configuration](https://docs.podman.io/en/latest/markdown/podman-network.1.html)

---

**Criado para**: Rocky Linux 9.7  
**Data**: Dezembro 2025  
**Podman Version**: 4.x+