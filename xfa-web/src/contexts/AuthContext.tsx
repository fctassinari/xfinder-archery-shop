import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import keycloak, { keycloakInitOptions } from '@/config/keycloak';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/services/apiClient';

interface User {
  email?: string;
  name?: string;
  preferredUsername?: string;
  subject?: string;
  roles?: string[];
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  active: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Novo: indica se Keycloak foi inicializado
  user: User | null;
  customer: Customer | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  syncCustomer: () => Promise<void>;
  initializeKeycloak: () => Promise<void>; // Novo: função para inicialização sob demanda
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Inicia como false (não carregando)
  const [isInitialized, setIsInitialized] = useState(false); // Novo: controla se foi inicializado
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false); // Evita múltiplas inicializações simultâneas
  const hasRestoredState = useRef(false); // Flag para evitar restaurar estado múltiplas vezes
  const hasInitializedKeycloak = useRef(false); // Flag para evitar inicializar Keycloak múltiplas vezes
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Função helper para verificar se já sincronizou nesta sessão (usando sessionStorage)
  const hasSyncedCustomer = (): boolean => {
    try {
      const synced = sessionStorage.getItem('keycloak_customer_synced');
      return synced === 'true';
    } catch (error) {
      return false;
    }
  };

  // Função helper para marcar como sincronizado
  const setSyncedCustomer = (value: boolean) => {
    try {
      if (value) {
        sessionStorage.setItem('keycloak_customer_synced', 'true');
      } else {
        sessionStorage.removeItem('keycloak_customer_synced');
      }
    } catch (error) {
      console.error('Erro ao salvar flag de sincronização:', error);
    }
  };

  // Função para verificar se há código de autorização na URL (após redirect do login)
  const hasAuthorizationCode = (): boolean => {
    const hash = window.location.hash;
    // Verificar se há 'code=' no hash (formato: #code=... ou #state=...&code=...)
    // Também verificar se há 'error=' que indica tentativa de login
    return hash.includes('code=') || hash.includes('error=') || hash.includes('state=');
  };

  // Função para inicializar Keycloak sob demanda
  const initializeKeycloak = async () => {
    // Se já está inicializado ou está inicializando, não fazer nada
    if (isInitialized || isInitializing) {
      return;
    }

    setIsInitializing(true);
    setIsLoading(true);

    try {
      // Verificar se o Keycloak está configurado corretamente
      if (!keycloak) {
        console.error('Keycloak não está configurado');
        setIsLoading(false);
        setIsAuthenticated(false);
        setIsInitialized(true); // Marcar como inicializado mesmo com erro
        setIsInitializing(false);
        return;
      }

      console.log('🔐 Inicializando Keycloak sob demanda...');
      console.log('🔍 Hash da URL:', window.location.hash);
      
      // Se há código na URL, usar 'login-required' em vez de 'check-sso' para processar o código
      const hash = window.location.hash;
      const hasCode = hash.includes('code=');
      const initOptions = hasCode 
        ? { ...keycloakInitOptions, onLoad: 'login-required' as const }
        : keycloakInitOptions;
      
      if (hasCode) {
        console.log('🔍 Detectado código na URL, usando login-required para processar...');
      }
      
      const authenticated = await keycloak.init(initOptions);
      console.log('🔍 Resultado do init:', authenticated);
      console.log('🔍 keycloak.authenticated:', keycloak.authenticated);
      console.log('🔍 keycloak.token:', keycloak.token ? 'Token presente' : 'Token ausente');
      
      // Aguardar um pouco para garantir que o token seja processado
      if (hasCode && authenticated) {
        // Dar tempo para o Keycloak processar o código e obter o token
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setIsAuthenticated(authenticated || false);
      setIsInitialized(true); // Marcar como inicializado
      setIsLoading(false);
      setIsInitializing(false);

      if (authenticated) {
        try {
          updateUserInfo();
          // Sincronizar customer APENAS quando o usuário faz login
          // Aguardar um pouco para garantir que o token foi processado
          setTimeout(() => {
            console.log('antes hasSyncedCustomer:', hasSyncedCustomer());
            // Sincronizar apenas se ainda não foi sincronizado nesta sessão
            if (!hasSyncedCustomer()) {
              console.log('🔄 Sincronizando keycloakId após login...');
              setSyncedCustomer(true);
              console.log('depois hasSyncedCustomer:', hasSyncedCustomer());
              syncCustomerMutation.mutate();
            } else {
              console.log('ℹ️ Customer já foi sincronizado nesta sessão, pulando...');
            }
          }, 500);
        } catch (error) {
          console.error('❌ Erro ao atualizar informações do usuário:', error);
        }
        
        // Configurar refresh automático do token
        try {
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).then((refreshed) => {
              if (refreshed) {
                try {
                  updateUserInfo();
                } catch (error) {
                  console.error('❌ Erro ao atualizar informações do usuário após refresh:', error);
                }
              }
            }).catch((error) => {
              console.error('❌ Erro ao atualizar token:', error);
            });
          };
        } catch (error) {
          console.error('❌ Erro ao configurar refresh automático do token:', error);
        }
        
        console.log('✅ Keycloak inicializado - Usuário autenticado');
        console.log('👤 Usuário:', keycloak.tokenParsed?.name || keycloak.tokenParsed?.email);
        
        // Limpar hash da URL após processar o código de autorização
        try {
          if (hasAuthorizationCode()) {
            console.log('🧹 Limpando hash da URL...');
            // Remover apenas o hash, mantendo o pathname
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } catch (error) {
          console.error('❌ Erro ao limpar hash da URL:', error);
        }
      } else {
        // Se não autenticado, garantir que os estados estão limpos
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        console.log('✅ Keycloak inicializado - Usuário não autenticado');
        
        // Se há erro na URL (ex: login_required), limpar hash
        if (window.location.hash.includes('error=')) {
          console.log('🧹 Limpando hash de erro da URL...');
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar Keycloak:', error);
      // Em caso de erro, definir estados seguros
      setIsLoading(false);
      setIsAuthenticated(false);
      setIsInitialized(true); // Marcar como inicializado mesmo com erro
      setIsInitializing(false);
      setUser(null);
      setToken(null);
    }
  };

  // Detectar código de autorização na URL e inicializar automaticamente
  useEffect(() => {
    // Se há código de autorização ou erro na URL, inicializar Keycloak automaticamente
    // Isso é necessário porque após o login, o Keycloak redireciona com o código no hash
    const hash = window.location.hash;
    const hasCode = hash.includes('code=');
    const hasError = hash.includes('error=');
    const hasState = hash.includes('state=');
    
    // IMPORTANTE: Ignorar error=login_required - isso é apenas um aviso, não um erro real
    // O error=login_required aparece quando check-sso não encontra sessão, mas não é um problema
    const hasLoginRequiredError = hash.includes('error=login_required');
    
    if ((hasCode || (hasError && !hasLoginRequiredError) || hasState) && !isInitialized && !isInitializing) {
      console.log('🔍 Detectado código/erro/state na URL:', { hasCode, hasError, hasState, hash });
      console.log('🔍 Inicializando Keycloak para processar...');
      initializeKeycloak();
    } else if (hasLoginRequiredError && !isInitialized && !isInitializing) {
      // Se há apenas error=login_required, limpar a URL mas não inicializar
      // Isso evita o erro aparecer na URL
      console.log('🧹 Limpando error=login_required da URL (não é um erro real)...');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [isInitialized, isInitializing]); // Re-executar se os estados mudarem

  // Verificar se o Keycloak já tem token armazenado e inicializar se necessário
  // Isso mantém o estado de autenticação e permite refresh de tokens
  // IMPORTANTE: Este useEffect só executa UMA VEZ quando o componente é montado pela primeira vez
  useEffect(() => {
    // Se já restaurou o estado anteriormente, não fazer nada
    if (hasRestoredState.current) {
      return;
    }
    
    // Só verificar se não foi inicializado e não está inicializando
    // E se não há código na URL (para não interferir no processo de login)
    if (isInitialized || isInitializing) {
      return;
    }
    
    const hash = window.location.hash;
    const hasCode = hash.includes('code=');
    const hasState = hash.includes('state=');
    
    // Não verificar se há código/state na URL (deixar o outro useEffect processar)
    if (hasCode || hasState) {
      return;
    }
    
    // Verificar se há estado de autenticação salvo no sessionStorage
    try {
      const savedAuthState = sessionStorage.getItem('keycloak_auth_state');
      if (savedAuthState) {
        const authState = JSON.parse(savedAuthState);
        if (authState.isAuthenticated && authState.user) {
          // Marcar que já tentou restaurar o estado
          hasRestoredState.current = true;
          
          // Só logar na primeira vez que restaurar o estado
          if (!hasInitializedKeycloak.current) {
            console.log('🔍 Estado de autenticação encontrado no sessionStorage, restaurando...');
          }
          
          setIsAuthenticated(true);
          setUser(authState.user);
          setToken(authState.token);
          
          // IMPORTANTE: Inicializar o Keycloak silenciosamente para ter acesso ao refresh token
          // Mas só fazer isso se não estiver na página de compra (para não interferir)
          // E apenas UMA VEZ durante toda a sessão
          const isCompraPage = window.location.pathname === '/compra';
          
          // Só inicializar se:
          // 1. Não estiver na página de compra
          // 2. Ainda não foi inicializado (usando ref para persistir entre navegações)
          // 3. O Keycloak ainda não está autenticado
          if (!isCompraPage && !hasInitializedKeycloak.current && !keycloak.authenticated && !isInitialized) {
            // Marcar que já tentou inicializar para não tentar novamente
            hasInitializedKeycloak.current = true;
            
            console.log('🔍 Inicializando Keycloak silenciosamente para permitir refresh de tokens...');
            setIsInitializing(true);
            
            keycloak.init({
              ...keycloakInitOptions,
              onLoad: 'check-sso',
              checkLoginIframe: false,
            })
              .then((authenticated) => {
                console.log('🔍 Keycloak inicializado silenciosamente:', authenticated);
                setIsInitialized(true);
                setIsInitializing(false);
                
                if (authenticated && keycloak.token) {
                  // Atualizar com token real do Keycloak
                  updateUserInfo();
                }
              })
              .catch((error) => {
                console.error('❌ Erro ao inicializar Keycloak silenciosamente:', error);
                setIsInitialized(true);
                setIsInitializing(false);
                // Manter estado do sessionStorage mesmo se falhar
              });
          } else if (isCompraPage) {
            // Se estiver na página de compra, não inicializar para não interferir
            // Não logar para evitar poluição do console
          } else if (keycloak.authenticated || hasInitializedKeycloak.current) {
            // Se já está autenticado ou já foi inicializado, não fazer nada
            // Não logar para evitar poluição do console
          }
        } else {
          // Se não há estado válido, marcar como já verificado para não verificar novamente
          hasRestoredState.current = true;
        }
      } else {
        // Se não há estado salvo, marcar como já verificado para não verificar novamente
        hasRestoredState.current = true;
      }
    } catch (error) {
      // Se não conseguir ler o sessionStorage, marcar como verificado para não tentar novamente
      console.error('Erro ao ler estado de autenticação do sessionStorage:', error);
      hasRestoredState.current = true;
    }
  }, []); // Executar apenas uma vez ao montar

  // Atualizar informações do usuário quando o token mudar
  const updateUserInfo = () => {
    try {
      if (keycloak.authenticated && keycloak.token) {
        // Verificar se o token está disponível antes de usar
        if (!keycloak.token) {
          console.warn('⚠️ Keycloak está autenticado mas token não está disponível');
          return;
        }
        
        setToken(keycloak.token);
        const userInfo: User = {
          email: keycloak.tokenParsed?.email as string,
          name: keycloak.tokenParsed?.name as string,
          preferredUsername: keycloak.tokenParsed?.preferred_username as string,
          subject: keycloak.tokenParsed?.sub as string,
          roles: keycloak.realmAccess?.roles || [],
        };
        setUser(userInfo);
        setIsAuthenticated(true);
        
        // Salvar estado no sessionStorage para manter ao navegar
        try {
          sessionStorage.setItem('keycloak_auth_state', JSON.stringify({
            isAuthenticated: true,
            user: userInfo,
            token: keycloak.token,
          }));
        } catch (error) {
          console.error('❌ Erro ao salvar estado de autenticação no sessionStorage:', error);
        }
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        
        // Limpar estado do sessionStorage
        try {
          sessionStorage.removeItem('keycloak_auth_state');
        } catch (error) {
          console.error('❌ Erro ao limpar estado de autenticação do sessionStorage:', error);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar informações do usuário:', error);
      // Em caso de erro, limpar estados para evitar estado inconsistente
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Query para obter dados do Customer
  // NOTA: 404 é esperado quando o customer ainda não foi sincronizado
  // O erro 404 no console do navegador é normal e não afeta o funcionamento
  const { data: customer } = useQuery<Customer>({
    queryKey: ['customer', isAuthenticated, token],
    queryFn: async () => {
      if (!isAuthenticated || !token) {
        return null;
      }
      try {
        const response = await apiClient.get('/api/auth/customer');
        return response.data;
      } catch (error: any) {
        // 404 é esperado quando o customer ainda não foi sincronizado
        // Não é um erro real, apenas indica que precisa sincronizar
        if (error.response?.status === 404) {
          // Retornar null silenciosamente - é comportamento esperado
          return null;
        }
        // 401 significa token inválido/expirado - não é erro crítico, apenas retornar null
        if (error.response?.status === 401) {
          // Token inválido/expirado - retornar null silenciosamente
          // O usuário precisará fazer login novamente
          return null;
        }
        // Para outros erros, logar mas não lançar para evitar quebrar a aplicação
        console.error('❌ Erro ao buscar dados do customer:', error);
        return null;
      }
    },
    enabled: isAuthenticated && !!token, // Só executar se tiver token
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    // Não tratar 404 e 401 como erro - são comportamentos esperados
    throwOnError: (error: any) => {
      // Não lançar erro se for 404 (customer não encontrado) ou 401 (token inválido)
      const status = error.response?.status;
      return status !== 404 && status !== 401;
    },
  });

  // Mutation para sincronizar Customer
  const syncCustomerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/api/auth/sync');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      toast({
        title: 'Sincronização realizada',
        description: 'Seus dados foram sincronizados com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro na sincronização',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });

  const login = async () => {
    // Quando o usuário clica explicitamente no botão de login,
    // devemos ir direto para o Keycloak sem fazer check-sso primeiro
    // Isso evita o error=login_required na primeira tentativa
    
    try {
      if (!keycloak) {
        console.error('Keycloak não está configurado');
        return;
      }
      
      // Se já está inicializado, usar keycloak.login() diretamente
      if (isInitialized) {
        console.log('🔐 Redirecionando para login do Keycloak...');
        keycloak.login({
          redirectUri: window.location.origin + window.location.pathname,
        });
        return;
      }
      
      // Se não está inicializado, inicializar com 'login-required'
      // Isso força o redirect direto para o login sem tentar check-sso
      console.log('🔐 Inicializando Keycloak com login-required para redirect direto...');
      setIsInitializing(true);
      setIsLoading(true);
      
      try {
        // Inicializar com 'login-required' que faz o redirect automaticamente
        const loginInitOptions = {
          ...keycloakInitOptions,
          onLoad: 'login-required' as const, // Força redirect para login
        };
        
        const authenticated = await keycloak.init(loginInitOptions);
        setIsInitialized(true);
        setIsInitializing(false);
        setIsLoading(false);
        
        if (authenticated) {
          // Se já estava autenticado, atualizar informações
          updateUserInfo();
          // Sincronizar customer APENAS quando o usuário faz login
          setTimeout(() => {
            if (!hasSyncedCustomer()) {
              console.log('🔄 Sincronizando keycloakId após login...');
              setSyncedCustomer(true);
              syncCustomerMutation.mutate();
            } else {
              console.log('ℹ️ Customer já foi sincronizado nesta sessão, pulando...');
            }
          }, 500);
          console.log('✅ Usuário já estava autenticado');
        } else {
          // Se não autenticado, o init com login-required já fez o redirect
          // Não precisamos fazer nada mais
          console.log('🔐 Redirect para login do Keycloak já foi feito pelo init');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar Keycloak para login:', error);
        // Se der erro no init, tentar fazer login manualmente
        setIsInitialized(true);
        setIsInitializing(false);
        setIsLoading(false);
        
        // Tentar fazer login manualmente como fallback
        try {
          keycloak.login({
            redirectUri: window.location.origin + window.location.pathname,
          });
        } catch (loginError) {
          console.error('❌ Erro ao fazer login manual:', loginError);
        }
      }
      
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      setIsInitializing(false);
      setIsLoading(false);
      setIsInitialized(false); // Resetar para permitir nova tentativa
    }
  };

  const logout = () => {
    try {
      // Verificar se keycloak está disponível antes de chamar logout
      if (!keycloak) {
        console.error('❌ Keycloak não está disponível para logout');
        // Mesmo assim, limpar estados locais
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        queryClient.clear();
        // Resetar flag de sincronização para permitir sincronização no próximo login
        setSyncedCustomer(false);
        console.log('hasSyncedCustomer false: 01');
        try {
          sessionStorage.removeItem('keycloak_auth_state');
        } catch (error) {
          console.error('Erro ao limpar estado de autenticação do sessionStorage:', error);
        }
        // Redirecionar para a página inicial
        window.location.href = '/';
        return;
      }

      // Limpar estados locais primeiro
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      queryClient.clear();
      // Resetar flag de sincronização para permitir sincronização no próximo login
      setSyncedCustomer(false);
      console.log('hasSyncedCustomer false: 02');

      
      // Limpar estado do sessionStorage
      try {
        sessionStorage.removeItem('keycloak_auth_state');
      } catch (error) {
        console.error('Erro ao limpar estado de autenticação do sessionStorage:', error);
      }

      // Chamar logout do Keycloak
      try {
        keycloak.logout({
          redirectUri: window.location.origin,
        });
      } catch (error) {
        console.error('❌ Erro ao fazer logout no Keycloak:', error);
        // Mesmo com erro, redirecionar para a página inicial
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Erro no processo de logout:', error);
      // Em caso de erro, garantir que os estados estão limpos
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      queryClient.clear();
      // Resetar flag de sincronização para permitir sincronização no próximo login
      setSyncedCustomer(false);
      console.log('hasSyncedCustomer false: 03');

      try {
        sessionStorage.removeItem('keycloak_auth_state');
      } catch (e) {
        console.error('Erro ao limpar estado de autenticação do sessionStorage:', e);
      }
      // Redirecionar para a página inicial
      window.location.href = '/';
    }
    
    // Limpar estado do sessionStorage
    try {
      sessionStorage.removeItem('keycloak_auth_state');
    } catch (error) {
      console.error('Erro ao limpar estado de autenticação do sessionStorage:', error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        updateUserInfo();
      }
      return refreshed;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      return false;
    }
  };

  const syncCustomer = async () => {
      return await syncCustomerMutation.mutateAsync();
  };

  // Sincronizar Customer automaticamente após login
  // IMPORTANTE: Só sincronizar UMA VEZ após o login bem-sucedido, não a cada navegação
  // REMOVIDO: Este useEffect estava causando sincronização a cada navegação
  // A sincronização agora acontece apenas quando o usuário faz login (no initializeKeycloak)

  const value: AuthContextType = {
    isAuthenticated: isAuthenticated ?? false,
    isLoading: isLoading ?? false,
    isInitialized: isInitialized ?? false,
    user: user ?? null,
    customer: customer || null,
    token: token ?? null,
    login,
    logout,
    refreshToken,
    syncCustomer,
    initializeKeycloak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Retornar valores padrão seguros em vez de lançar erro
    // Isso evita quebra da aplicação se o contexto não estiver disponível
    console.warn('useAuth está sendo usado fora de AuthProvider. Retornando valores padrão.');
    return {
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      user: null,
      customer: null,
      token: null,
      login: () => {
        console.warn('Login chamado mas AuthProvider não está disponível');
      },
      logout: () => {
        console.warn('Logout chamado mas AuthProvider não está disponível');
      },
      refreshToken: async () => false,
      syncCustomer: async () => {
        console.warn('syncCustomer chamado mas AuthProvider não está disponível');
      },
      initializeKeycloak: async () => {
        console.warn('initializeKeycloak chamado mas AuthProvider não está disponível');
      },
    };
  }
  return context;
};

