import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import keycloak from '@/config/keycloak';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// Criar instância do axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // IMPORTANTE: Só adicionar token se a URL for da nossa API interna
    // URLs externas (SuperFrete, InfinitePay, etc.) não devem receber token
    const requestUrl = config.url || '';
    const baseUrl = config.baseURL || API_BASE_URL;
    const fullUrl = requestUrl.startsWith('http') ? requestUrl : `${baseUrl}${requestUrl}`;
    
    // Verificar se é uma chamada para API externa (não deve adicionar token)
    const isExternalApi = fullUrl.includes('superfrete.com') || 
                         fullUrl.includes('infinitepay.io') || 
                         fullUrl.includes('checkout.infinitepay');
    
    if (isExternalApi) {
      // Não adicionar token para APIs externas
      return config;
    }

    // Tentar obter token do Keycloak ou do sessionStorage
    let token: string | null = null;
    
    // Primeiro, tentar usar token do Keycloak se estiver inicializado
    if (keycloak.authenticated && keycloak.token) {
      // Verificar se o token está expirado ou próximo de expirar
      if (keycloak.isTokenExpired(30)) {
        try {
          // Tentar atualizar o token apenas se o Keycloak estiver inicializado
          // Se não estiver inicializado, não há refresh token disponível
          if (keycloak.refreshToken) {
            await keycloak.updateToken(30);
            token = keycloak.token || null;
          } else {
            // Se não há refresh token, tentar usar token do sessionStorage
            console.warn('[apiClient] Keycloak não inicializado, tentando usar token do sessionStorage');
            const savedAuthState = sessionStorage.getItem('keycloak_auth_state');
            if (savedAuthState) {
              try {
                const authState = JSON.parse(savedAuthState);
                token = authState.token || null;
              } catch (e) {
                console.error('[apiClient] Erro ao ler token do sessionStorage:', e);
              }
            }
          }
        } catch (error) {
          console.error('Erro ao atualizar token:', error);
          // Tentar usar token do sessionStorage como fallback
          const savedAuthState = sessionStorage.getItem('keycloak_auth_state');
          if (savedAuthState) {
            try {
              const authState = JSON.parse(savedAuthState);
              token = authState.token || null;
            } catch (e) {
              console.error('[apiClient] Erro ao ler token do sessionStorage:', e);
            }
          }
        }
      } else {
        token = keycloak.token;
      }
    } else {
      // Se Keycloak não está autenticado, tentar usar token do sessionStorage
      const savedAuthState = sessionStorage.getItem('keycloak_auth_state');
      if (savedAuthState) {
        try {
          const authState = JSON.parse(savedAuthState);
          token = authState.token || null;
        } catch (e) {
          console.error('[apiClient] Erro ao ler token do sessionStorage:', e);
        }
      }
    }

    // Adicionar token no header Authorization se disponível
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: logar qual token está sendo enviado
      if (import.meta.env.DEV) {
        console.log('[apiClient] Enviando ACCESS TOKEN para API interna (primeiros 50 chars):', 
          token.substring(0, 50) + '...');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verificar se é uma chamada para API externa (não deve processar erros de autenticação)
    const requestUrl = originalRequest?.url || '';
    const baseUrl = originalRequest?.baseURL || API_BASE_URL;
    const fullUrl = requestUrl.startsWith('http') ? requestUrl : `${baseUrl}${requestUrl}`;
    
    const isExternalApi = fullUrl.includes('superfrete.com') || 
                         fullUrl.includes('infinitepay.io') || 
                         fullUrl.includes('checkout.infinitepay');
    
    // Se for API externa, não processar erros de autenticação
    if (isExternalApi) {
      return Promise.reject(error);
    }

    // 404 em /api/auth/customer é esperado quando o customer ainda não foi sincronizado
    // Não é um erro real, apenas indica que precisa sincronizar
    if (error.response?.status === 404 && requestUrl?.includes('/api/auth/customer')) {
      // Retornar erro silenciosamente - o código que chama já trata isso
      return Promise.reject(error);
    }

    // Se receber 401 (Não autorizado) e ainda não tentou renovar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar atualizar o token apenas se o Keycloak estiver inicializado e tiver refresh token
        if (keycloak.authenticated && keycloak.refreshToken) {
          await keycloak.updateToken(30);
          
          // Adicionar novo token no header
          if (originalRequest.headers && keycloak.token) {
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        } else {
          // Se não há refresh token, tentar usar token do sessionStorage
          console.warn('[apiClient] Keycloak não inicializado ou sem refresh token, tentando usar token do sessionStorage');
          const savedAuthState = sessionStorage.getItem('keycloak_auth_state');
          if (savedAuthState) {
            try {
              const authState = JSON.parse(savedAuthState);
              if (authState.token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${authState.token}`;
              }
            } catch (e) {
              console.error('[apiClient] Erro ao ler token do sessionStorage:', e);
              return Promise.reject(error);
            }
          } else {
            // Se não há token no sessionStorage, rejeitar o erro
            console.error('[apiClient] Não há token disponível para renovar');
            return Promise.reject(error);
          }
        }

        // Repetir a requisição original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Se falhar ao atualizar, apenas logar o erro
        // Não fazer logout automático para não interromper fluxos em andamento
        console.error('Erro ao atualizar token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Se receber 403 (Proibido), pode ser problema de permissão
    if (error.response?.status === 403) {
      console.error('Acesso negado: você não tem permissão para esta ação');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

