/**
 * Configurações centralizadas da aplicação
 * Carregadas do backend via configService
 */

import { loadConfig, getConfig, type FrontendConfig } from '@/services/configService';

let config: FrontendConfig | null = null;
let isLoading = false;
let loadPromise: Promise<FrontendConfig> | null = null;

/**
 * Inicializa as configurações (deve ser chamado antes de usar a aplicação)
 */
export async function initConfig(): Promise<FrontendConfig> {
  if (config) {
    return config;
  }

  if (loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = loadConfig().then((loadedConfig) => {
    config = loadedConfig;
    isLoading = false;
    return loadedConfig;
  });

  return loadPromise;
}

/**
 * Obtém as configurações (lança erro se não inicializado)
 */
export function getAppConfig(): FrontendConfig {
  if (!config) {
    throw new Error('Configurações não foram inicializadas. Chame initConfig() primeiro.');
  }
  return config;
}

/**
 * Verifica se as configurações foram carregadas
 */
export function isConfigLoaded(): boolean {
  return config !== null;
}

/**
 * Obtém configuração do Keycloak
 */
export function getKeycloakConfig() {
  return getAppConfig().keycloak;
}

/**
 * Obtém URLs da API
 */
export function getApiConfig() {
  return getAppConfig().api;
}

/**
 * Obtém configurações da aplicação
 */
export function getAppUrls() {
  return getAppConfig().app;
}

/**
 * Obtém configurações de pagamento
 */
export function getPaymentConfig() {
  return getAppConfig().payment;
}

/**
 * Obtém informações da loja
 */
export function getStoreConfig() {
  return getAppConfig().store;
}

/**
 * Obtém features/flags
 */
export function getFeaturesConfig() {
  return getAppConfig().features;
}

// Exportar tipos
export type { FrontendConfig };
