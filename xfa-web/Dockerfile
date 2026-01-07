FROM registry.access.redhat.com/ubi10/nodejs-22:10.0-1755005674 AS builder

USER root

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências (inclui keycloak-js e todas as outras)
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação (configurações serão buscadas do backend em runtime)
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