# XFinder Archery DB

```bash
podman volume create vl-xfinder-postgres

podman run --name xfinder-postgres -p 5432:5432 -e POSTGRES_PASSWORD=XF@2025 --volume vl-xfinder-postgres:/var/lib/postgresql -d postgres:18.0

```

```
-- Database: xfa

-- DROP DATABASE IF EXISTS xfa;

CREATE DATABASE xfa
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
```

