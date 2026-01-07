import Keycloak from 'keycloak-js';
import { getKeycloakConfig, isConfigLoaded } from './appConfig';

// Função para obter configuração do Keycloak (com fallback)
function getKeycloakConfigWithFallback() {
  try {
    if (isConfigLoaded()) {
      return getKeycloakConfig();
    }
  } catch (error) {
    // console.warn('Configurações não carregadas ainda, usando fallback para Keycloak');
  }
  
  // Fallback para valores padrão
  return {
    url: 'https://localhost:8443',
    realm: 'xfinder',
    clientId: 'xfinder-web',
  };
}

// Configuração do Keycloak (inicializada dinamicamente)
const keycloakConfig = getKeycloakConfigWithFallback();

// Validar configuração antes de criar instância
if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
  // console.warn('Configuração do Keycloak incompleta. Verifique as variáveis de ambiente.');
}

// Inicializar Keycloak
let keycloak: Keycloak;

try {
  keycloak = new Keycloak({
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
  });
  // console.log('Keycloak configurado:', {
  //   url: keycloakConfig.url,
  //   realm: keycloakConfig.realm,
  //   clientId: keycloakConfig.clientId,
  // });
} catch (error) {
  // console.error('Erro ao criar instância do Keycloak:', error);
  // Criar uma instância com valores padrão para evitar erros
  keycloak = new Keycloak({
    url: 'https://localhost:8443',
    realm: 'xfinder',
    clientId: 'xfinder-web',
  });
}

// Função para reconfigurar Keycloak quando as configurações estiverem disponíveis
export function reconfigureKeycloak() {
  try {
    if (isConfigLoaded()) {
      const config = getKeycloakConfig();
      // Keycloak não permite reconfiguração dinâmica, mas podemos logar
      // console.log('Keycloak reconfigurado com:', config);
    }
  } catch (error) {
    // console.warn('Não foi possível reconfigurar Keycloak:', error);
  }
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

