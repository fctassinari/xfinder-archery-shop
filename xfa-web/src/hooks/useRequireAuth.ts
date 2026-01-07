import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para inicializar Keycloak sob demanda quando uma rota/proteção requer autenticação.
 * 
 * Este hook deve ser usado em:
 * - Componentes de rotas protegidas
 * - Componentes que precisam verificar autenticação
 * 
 * Ele garante que o Keycloak seja inicializado apenas quando necessário,
 * evitando redirects desnecessários em rotas públicas.
 */
export const useRequireAuth = () => {
  const { initializeKeycloak, isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    // Inicializar Keycloak quando o hook é usado (componente monta)
    if (!isInitialized) {
      // console.log('🔐 useRequireAuth: Inicializando Keycloak...');
      initializeKeycloak();
    }
  }, [isInitialized, initializeKeycloak]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
  };
};

