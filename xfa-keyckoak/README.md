### Keycloak

[Docs](https://www.keycloak.org/server/containers)

**Criar Database Keycloak**
```bash
    podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```

**Build da imagem**
``` bash
    podman build -t xfinder-keycloak:latest .
```

**Subir Keycloak (primeira vez - com import do realm)**

**No Git Bash (usando caminho absoluto fixo):**
```bash
    # Substitua pelo seu caminho completo no formato Windows
    podman run -d \
        --tz=America/Sao_Paulo \
        --name xfinder-keycloak \
        --network nt-xfinder \
        -p 8443:8443 -p 9000:9000 \
        -v "C:/Users/FábioTassinari/Downloads/dev/git/xfinder/xfinder-archery-shop/xfa-keyckoak/realm-export.json:/opt/keycloak/data/import/realm-export.json:Z" \
        xfinder-keycloak:latest start \
        --optimized \
        --http-enabled=true \
        --import-realm
```
    -v "C:/Users/integ/Downloads/dev/git/xfinder-archery-shop/xfa-keyckoak/realm-export.json:/opt/keycloak/data/import/realm-export.json:Z" \

**Subir Keycloak (execuções subsequentes)**
```bash
    podman start xfinder-keycloak
```

**Importar realm manualmente (após Keycloak estar rodando)**

Se você precisar importar o realm após o Keycloak já estar em execução:

```bash
    # Copiar o arquivo para o container (use caminho absoluto no Windows)
    podman cp "C:/Users/integ/Downloads/dev/git/xfinder-archery-shop/xfa-keyckoak/realm-export.json" xfinder-keycloak:/tmp/realm-export.json
    
    # Alternativa no PowerShell (obter caminho dinamicamente):
    # podman cp "$(Get-Location)\realm-export.json" xfinder-keycloak:/tmp/realm-export.json
    
    # Importar o realm
    podman exec -it xfinder-keycloak /opt/keycloak/bin/kc.sh import --file /tmp/realm-export.json --override false
```

**Alternativa: Importar via API REST usando curl**

```bash
    # Obter token de acesso do admin
    TOKEN=$(curl -X POST 'http://localhost:9000/realms/master/protocol/openid-connect/token' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -d 'username=admin' \
        -d 'password=XFA@2025' \
        -d 'grant_type=password' \
        -d 'client_id=admin-cli' | jq -r '.access_token')
    
    # Importar realm
    curl -X POST 'http://localhost:9000/admin/realms' \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d @realm-export.json
```

**Acessar Keycloak Admin Console**
- URL: http://localhost:9000
- Usuário: admin
- Senha: XFA@2025

---