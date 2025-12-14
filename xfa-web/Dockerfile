FROM registry.access.redhat.com/ubi10/nodejs-22:10.0-1755005674 AS builder

USER root

# Definir diretório de trabalho
WORKDIR /app

# Argumentos de build para variáveis de ambiente
ARG VITE_API_BASE_URL=http://localhost:8081
ARG VITE_KEYCLOAK_URL=https://localhost:8443
ARG VITE_KEYCLOAK_REALM=xfinder
ARG VITE_KEYCLOAK_CLIENT_ID=xfinder-web
ARG VITE_APP_BASE_URL=http://localhost:8080

# Variáveis de ambiente para o build do Vite
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL}
ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM}
ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID}
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}

# Copiar arquivos de dependências
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências (inclui keycloak-js e todas as outras)
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação (as variáveis de ambiente serão injetadas aqui)
RUN npm run build
USER 1001

# Estágio final - imagem de produção
FROM registry.access.redhat.com/ubi10/nginx-126:10.0-1755015258

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretório para PID do nginx
RUN mkdir -p /var/run/nginx

EXPOSE 8080

# Run script uses standard ways to run the application
CMD nginx -g "daemon off;"