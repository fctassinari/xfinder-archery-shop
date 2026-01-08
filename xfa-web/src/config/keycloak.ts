import Keycloak from 'keycloak-js';
import { getKeycloakConfig, isConfigLoaded } from './appConfig';

// Função para obter configuração do Keycloak (com fallback)
function getKeycloakConfigWithFallback() {
  // Priorizar sempre as configurações carregadas do backend
  try {
    if (isConfigLoaded()) {
      const config = getKeycloakConfig();
      // console.log('Usando configuração do backend:', config);
      return config;
    }
  } catch (error) {
    // console.warn('Configurações não carregadas ainda, usando fallback para Keycloak');
  }
  
  // Fallback para valores padrão (apenas em desenvolvimento)
  if (import.meta.env.DEV) {
    return {
      url: 'https://localhost:8443',
      realm: 'xfinder',
      clientId: 'xfinder-web',
    };
  }
  
  // Em produção, tentar inferir a URL do Keycloak da URL atual
  // O Keycloak geralmente está na mesma origem que o frontend
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Se houver porta explícita, usar a mesma origem (Keycloak está na mesma origem)
  if (port) {
    return {
      url: `${protocol}//${hostname}:${port}`,
      realm: 'xfinder',
      clientId: 'xfinder-web',
    };
  }
  
  // Se não houver porta, usar a mesma origem
  return {
    url: `${protocol}//${hostname}`,
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
    // console.error('Erro ao criar instância do Keycloak:', error);
    // Em caso de erro, criar uma instância com valores padrão para evitar quebra da aplicação
    keycloakInstance = new Keycloak({
      url: keycloakConfig.url || 'https://localhost:8443',
      realm: keycloakConfig.realm || 'xfinder',
      clientId: keycloakConfig.clientId || 'xfinder-web',
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

