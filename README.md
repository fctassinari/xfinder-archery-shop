# Criar ambiente X-Finder Archery Shop

**Start podman**
```bash
  podman machine start
```
**Criar rede xfinder**
```bash
  podman network create nt-xfinder
```
---
**Subir Banco de Dados**

**Criar volume postgres**
```bash
  podman volume create vl-xfinder-postgres
```
**Criar container postres**
```bash
  podman run --name xfinder-postgres --network nt-xfinder -p 5432:5432 -e POSTGRES_PASSWORD=XFA@2025 --volume vl-xfinder-postgres:/var/lib/postgresql -d postgres:18.0
```
**Criar Data Base**
```bash
  podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
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

[Subir API](xfa-api/README-Api.md)

---
[Subir Web](xfa-web/README-Web.md)

---
[Desenhos download](https://www.pngwing.com/)