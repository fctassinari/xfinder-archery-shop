FROM quay.io/keycloak/keycloak:latest AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# change these values to point to a running postgres instance
ENV KC_DB='postgres'
#ENV KC_DB_URL='jdbc:postgresql://xfinder-postgres:5432/keycloak?ssl=true&sslmode=require&connectTimeout=30&socketTimeout=60'
ENV KC_DB_URL='jdbc:postgresql://xfinder-postgres:5432/keycloak'
ENV KC_DB_USERNAME='postgres'
ENV KC_DB_PASSWORD='XFA@2025'
ENV KC_HOSTNAME='localhost'
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=XFA@2025
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]