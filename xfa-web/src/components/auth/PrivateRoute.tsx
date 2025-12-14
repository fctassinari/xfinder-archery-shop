import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // useRequireAuth garante que Keycloak seja inicializado quando acessa rota protegida
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { isInitialized } = useAuth();

  // Mostrar loading enquanto Keycloak está sendo inicializado
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não autenticado após inicialização, redirecionar para home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

