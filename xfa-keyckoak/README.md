### Keycloak

[Docs](https://www.keycloak.org/server/containers)

```bash
    podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```

``` bash
    podman build -t xfinder-keycloak:latest .
```

```bash
    podman run -d --name xfinder-keycloak --network nt-xfinder -p 8443:8443 -p 9000:9000  \
        xfinder-keycloak:latest start --optimized --http-enabled=true  
```
```bash
  podman start xfinder-keycloak
```
---