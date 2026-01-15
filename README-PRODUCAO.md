# Guia para colocar o site X-Finder Archery Shop em produção

## **Iniciar podman**
```bash
  podman machine start
```
---
## **Criar rede xfinder**
```bash
  podman network create nt-xfinder
```
---
## **Banco de Dados**

**Criar volume postgres**
```bash
  podman volume create postgres
```
**Criar container postres**
```bash
  podman run --tz=America/Sao_Paulo --name xfinder-postgres --network nt-xfinder -p 5432:5432 -e POSTGRES_PASSWORD=XFA@2025 --volume postgres:/var/lib/postgresql  -d postgres:18.0 
```
**Criar Data Base XFinder**
```bash
  podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```
**Criar Data Base Keycloak**
```bash
    podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```
**Acessar linha de comando postgres**
```bash
  podman exec -it xfinder-postgres psql -U postgres -d xfa
```
**Start pod postgres**
```bash
  podman start xfinder-postgres 
```
---
## **xfa-keycloak**
[Quick Start](xfa-keyckoak/docs/QUICK-START-PRODUCAO.md)

---
## **xfa-api**
**Ajustar application.properties**

**Executar em container**

```bash
  cd xfa-api
  # podman stop xfinder-api
  systemctl stop xfinder-api.service 2>/dev/null || true
  # podman rm xfinder-api
  ./mvnw package -DskipTests=true
  podman build -f src/main/docker/Dockerfile.jvm -t xfinder-api:latest .
  # podman run -d  --tz=America/Sao_Paulo --name xfinder-api --network nt-xfinder -p 8085:8085 xfinder-api:latest
  systemctl start xfinder-api.service
  cd ..
```
```bash
  podman start xfinder-api
```

**Cadastrar Produtos**
```bash
    jq -c '.[]' product.json | while read produto; do 
      nome=$(echo "$produto" | jq -r '.name')
      echo "Enviando produto: $nome..."
      curl -s -X POST "http://localhost:8085/api/products" \
        -H "Content-Type: application/json" \
        -d "$produto"
      echo -e "\n---"
    done
```

---
## **xfa-web**

```shell
  cd xfa-web
  # podman stop xfinder-web
  systemctl stop xfinder-web.service 2>/dev/null || true
  # podman rm xfinder-web
  podman build -t xfinder-web:latest .
  # podman run -d  --tz=America/Sao_Paulo --name xfinder-web -p 8083:8080 --network nt-xfinder --restart unless-stopped xfinder-web:latest
  systemctl start xfinder-web.service
  cd ..
```
```bash
  podman start xfinder-web
```
---

## **Stop / Start**
    systemctl stop xfinder-web.service 2>/dev/null || true
    systemctl stop xfinder-keycloak.service 2>/dev/null || true
    systemctl stop xfinder-api.service 2>/dev/null || true
    systemctl stop xfinder-postgres.service 2>/dev/null || true


    systemctl start xfinder-postgres.service 2>/dev/null || true
    systemctl start xfinder-keycloak.service 2>/dev/null || true
    systemctl start xfinder-api.service 2>/dev/null || true
    systemctl start xfinder-web.service 2>/dev/null || true







sudo firewall-cmd  --permanente --add-rich-rule='rule family="ipv4" source address="173.245.48.0/20" port port="80" protocol="tcp" accept'
sudo firewall-cmd  --permanente --add-rich-rule='rule family="ipv4" source address="173.245.48.0/20" port port="443" protocol="tcp" accept'
sudo firewall-cmd --reload

