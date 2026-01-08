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
}

let cachedConfig: FrontendConfig | null = null;
let configPromise: Promise<FrontendConfig> | null = null;

/**
 * Obtém a URL base da API para buscar configurações
 * Usa fallback para desenvolvimento local
 */
function getConfigApiUrl(): string {
  // Em desenvolvimento, tenta usar variável de ambiente ou fallback
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  }
  // Em produção, usa a mesma origem (a API está na mesma origem que o frontend)
  // O nginx ou proxy reverso roteia as requisições para a API
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Se houver porta explícita, mantém a mesma porta (API está na mesma origem)
  if (port) {
    return `${protocol}//${hostname}:${port}`;
  }
  
  // Se não houver porta (porta padrão do protocolo), usa a mesma origem
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
    // console.error('Erro ao buscar configurações do backend:', error);
    
    // Fallback para valores padrão em caso de erro
    return {
      keycloak: {
        url: 'https://localhost:8443',
        realm: 'xfinder',
        clientId: 'xfinder-web',
      },
      api: {
        baseUrl: 'http://localhost:8081',
        productsUrl: 'http://localhost:8081/api/products',
        customersUrl: 'http://localhost:8081/api/customers',
        ordersUrl: 'http://localhost:8081/api/orders',
        mailUrl: 'http://localhost:8081/api/mail',
        superfreteUrl: 'http://localhost:8081/api/superfrete/calculate-freight',
      },
      app: {
        baseUrl: 'http://localhost:8080',
        imageUrl: 'http://localhost:8080',
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
