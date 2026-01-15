/**
 * Serviço para buscar e cachear configurações do backend
 */

export interface FrontendConfig {
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
  api: {
    baseUrl: string;
    productsUrl: string;
    customersUrl: string;
    ordersUrl: string;
    mailUrl: string;
    superfreteUrl: string;
  };
  app: {
    baseUrl: string;
    imageUrl: string;
  };
  payment: {
    checkoutBaseUrl: string;
  };
  store: {
    postalCode: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
  };
  features: {
    useMockCheckout: boolean;
  };
  googleMaps: {
    apiKey: string;
  };
}

let cachedConfig: FrontendConfig | null = null;
let configPromise: Promise<FrontendConfig> | null = null;

/**
 * Obtém a URL base da API para buscar configurações
 * Detecta automaticamente baseado na URL atual do navegador
 * 
 * A API deve estar acessível na mesma origem que o frontend.
 * Em produção, o nginx/proxy reverso roteia as requisições para a API.
 * Em desenvolvimento, se a API estiver em outra porta, deve ser configurado
 * um proxy reverso ou a URL deve ser acessada diretamente.
 */
function getConfigApiUrl(): string {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Sempre usar a mesma origem do navegador
  // Se houver porta explícita, incluir na URL
  if (port) {
    return `${protocol}//${hostname}:${port}`;
  }
  
  // Se não houver porta (porta padrão do protocolo), usar a mesma origem
  // Em produção com HTTPS, a API geralmente está na mesma origem
  return `${protocol}//${hostname}`;
}

/**
 * Busca as configurações do backend
 */
async function fetchConfig(): Promise<FrontendConfig> {
  const apiUrl = getConfigApiUrl();
  const configUrl = `${apiUrl}/api/config/frontend`;

  try {
    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }

    const config = await response.json();
    return config as FrontendConfig;
  } catch (error) {
    console.error('Erro ao buscar configurações do backend:', error);
    
    // Em caso de erro, tentar inferir valores baseados na URL atual
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Determinar URL base da API (fallback apenas se endpoint falhar)
    // Usar sempre a mesma origem do navegador
    let apiBaseUrl: string;
    if (port) {
      apiBaseUrl = `${protocol}//${hostname}:${port}`;
    } else {
      apiBaseUrl = `${protocol}//${hostname}`;
    }
    
    // Determinar URL base do app (fallback apenas se endpoint falhar)
    // Usar sempre a mesma origem do navegador
    let appBaseUrl: string;
    if (port) {
      appBaseUrl = `${protocol}//${hostname}:${port}`;
    } else {
      appBaseUrl = `${protocol}//${hostname}`;
    }
    
    // Determinar URL do Keycloak (fallback apenas se endpoint falhar)
    // Em produção, geralmente está na mesma origem. Em desenvolvimento local,
    // pode estar em outra porta, mas tentamos inferir da URL atual primeiro
    let keycloakUrl: string;
    if (port) {
      keycloakUrl = `${protocol}//${hostname}:${port}`;
    } else {
      keycloakUrl = `${protocol}//${hostname}`;
    }
    
    // Retornar configuração inferida (apenas como fallback de emergência)
    return {
      keycloak: {
        url: keycloakUrl,
        realm: 'xfinder',
        clientId: 'xfinder-web',
      },
      api: {
        baseUrl: apiBaseUrl,
        productsUrl: `${apiBaseUrl}/api/products`,
        customersUrl: `${apiBaseUrl}/api/customers`,
        ordersUrl: `${apiBaseUrl}/api/orders`,
        mailUrl: `${apiBaseUrl}/api/mail`,
        superfreteUrl: `${apiBaseUrl}/api/superfrete/calculate-freight`,
      },
      app: {
        baseUrl: appBaseUrl,
        imageUrl: appBaseUrl,
      },
      payment: {
        checkoutBaseUrl: 'https://checkout.infinitepay.io/fctassinari',
      },
      store: {
        postalCode: '03167030',
        email: 'contato.xfinder@gmail.com.br',
        name: 'Fabio Tassinari',
        phone: '11991318744',
        address: 'Rua dos Capitães Mores',
        number: '346',
        complement: 'Apto 101B',
        district: 'Mooca',
        city: 'São Paulo',
        state: 'SP',
      },
      features: {
        useMockCheckout: false,
      },
      googleMaps: {
        apiKey: '',
      },
    };
  }
}

/**
 * Carrega as configurações do backend (com cache)
 */
export async function loadConfig(): Promise<FrontendConfig> {
  // Se já temos config em cache, retorna imediatamente
  if (cachedConfig) {
    return cachedConfig;
  }

  // Se já existe uma requisição em andamento, aguarda ela
  if (configPromise) {
    return configPromise;
  }

  // Cria nova requisição
  configPromise = fetchConfig().then((config) => {
    cachedConfig = config;
    return config;
  });

  return configPromise;
}

/**
 * Obtém as configurações (sincronamente se já carregadas)
 */
export function getConfig(): FrontendConfig | null {
  return cachedConfig;
}

/**
 * Limpa o cache de configurações (útil para testes ou reload)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
  configPromise = null;
}
