# Criar ambiente X-Finder Archery Shop

**Start podman**
```bash
  podman machine start
```
---
**Criar volume postgres**
```bash
  podman volume create vl-xfinder-postgres
```
**Criar container postres**
```bash
  podman run --name xfinder-postgres -p 5432:5432 -e POSTGRES_PASSWORD=XFA@2025 --volume vl-xfinder-postgres:/var/lib/postgresql -d postgres:18.0
```
**Criar Data Base**
```bash
  podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```
---
**Subir modo dev da API**

```bash
  cd xfa-api 
```
```bash
  ./xfa-api/mvnw quarkus:dev -DskipTests=true
```

**Criar somente o pacote da API**

```bash
  cd xfa-api 
```
```shell script
  ./mvnw clean package -DskipTests=true
```
**Cadastrar Produtos**
```shell script
    jq -c '.[]' product.json | while read produto; do
      nome=$(echo "$produto" | jq -r '.name')
      echo "Enviando produto: $nome..."
      curl -s -X POST "http://localhost:8081/api/products" \
        -H "Content-Type: application/json" \
        -d "$produto"
      echo -e "\n---"
    done
```
**Acessar linha de comando postgres**
```bash
  podman exec -it xfinder-postgres psql -U postgres -d xfa
```
---
**Build da Imagem Web**
```shell script
  cd xfa-web 
```

```bash
  podman build -t xfinder-archery-shop:latest .
```
**Parar o container Web **
```bash
  podman stop xfinder-archery-shop
```
**Apagar o conatiner Web **
```bash
  podman rm xfinder-archery-shop
```
**Subir o container Web**
```bash
  podman run -d --name xfinder-archery-shop -p 8080:8080 --restart unless-stopped xfinder-archery-shop:latest
```
[XFinder Archery](http://localhost:8080)
