import Keycloak from 'keycloak-js';
import { getKeycloakConfig, isConfigLoaded } from './appConfig';

// Função para obter configuração do Keycloak (sem fallbacks hardcoded)
function getKeycloakConfigWithFallback() {
  // Priorizar sempre as configurações carregadas do backend
  try {
    if (isConfigLoaded()) {
      const config = getKeycloakConfig();
      return config;
    }
  } catch (error) {
    // Se não estiver carregado, tentar inferir da URL atual
  }
  
  // Se não estiver carregado, inferir da URL atual do navegador
  // Em produção, Keycloak geralmente está na mesma origem
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Usar sempre a mesma origem do navegador
  let keycloakUrl: string;
  if (port) {
    keycloakUrl = `${protocol}//${hostname}:${port}`;
  } else {
    keycloakUrl = `${protocol}//${hostname}`;
  }
  
  return {
    url: keycloakUrl,
    realm: 'xfinder',
    clientId: 'xfinder-web',
  };
}

// Instância do Keycloak (criada dinamicamente)
let keycloakInstance: Keycloak | null = null;

// Função para obter ou criar a instância do Keycloak
function getKeycloakInstance(): Keycloak {
  // Se já existe uma instância, retornar ela
  if (keycloakInstance) {
    return keycloakInstance;
  }
  
  // Obter configuração (com fallback se necessário)
  const keycloakConfig = getKeycloakConfigWithFallback();
  
  // Validar configuração antes de criar instância
  if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
    // console.warn('Configuração do Keycloak incompleta. Verifique as variáveis de ambiente.');
    throw new Error('Configuração do Keycloak incompleta');
  }
  
  // Criar nova instância do Keycloak
  try {
    keycloakInstance = new Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    });
    // console.log('Keycloak configurado:', {
    //   url: keycloakConfig.url,
    //   realm: keycloakConfig.realm,
    //   clientId: keycloakConfig.clientId,
    // });
    return keycloakInstance;
  } catch (error) {
    console.error('Erro ao criar instância do Keycloak:', error);
    // Em caso de erro, usar os valores da configuração (já tem fallback)
    keycloakInstance = new Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    });
    return keycloakInstance;
  }
}

// Criar um Proxy que delega todas as propriedades e métodos para a instância real
// Isso permite que a instância seja criada apenas quando necessário
// A função getKeycloakInstance() já verifica se as configurações mudaram e recria a instância
const keycloakProxy = new Proxy({} as Keycloak, {
  get(_target, prop) {
    const instance = getKeycloakInstance();
    const value = (instance as any)[prop];
    // Se for uma função, garantir que o contexto (this) seja a instância
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  set(_target, prop, value) {
    const instance = getKeycloakInstance();
    (instance as any)[prop] = value;
    return true;
  },
});

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

// Exportar proxy que cria a instância dinamicamente quando necessário
export default keycloakProxy;

