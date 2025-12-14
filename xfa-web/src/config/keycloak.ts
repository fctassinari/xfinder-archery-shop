import Keycloak from 'keycloak-js';

// Configuração do Keycloak
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'https://localhost:8443',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'xfinder',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'xfinder-web',
};

// Validar configuração antes de criar instância
if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
  console.warn('Configuração do Keycloak incompleta. Verifique as variáveis de ambiente.');
}

// Inicializar Keycloak
let keycloak: Keycloak;

try {
  keycloak = new Keycloak(keycloakConfig);
  console.log('Keycloak configurado:', {
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
  });
} catch (error) {
  console.error('Erro ao criar instância do Keycloak:', error);
  // Criar uma instância com valores padrão para evitar erros
  keycloak = new Keycloak({
    url: 'https://localhost:8443',
    realm: 'xfinder',
    clientId: 'xfinder-web',
  });
}

// Configurações de inicialização
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const, // Verificar SSO silenciosamente
  pkceMethod: 'S256' as const, // Usar PKCE com S256
  checkLoginIframe: false, // Desabilitar verificação de iframe (melhor performance)
  enableLogging: import.meta.env.DEV, // Logs apenas em desenvolvimento
  flow: 'standard' as const, // Authorization Code Flow
};

export default keycloak;

