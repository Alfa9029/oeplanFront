import { ref, computed } from 'vue';
import type { User } from '~/shared/types/auth/user';
import type { UserLogin } from '~/shared/types/auth/user-login';

// --- Configuração do Mock ---
const USE_MOCK_BACKEND = true;
// --------------------------

interface MagicLinkRequestResponse {
  success: boolean;
  message?: string;
}

interface MagicLinkVerifyResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

const MOCK_PROFESSOR_USER: User = {
  uuid: 'mock-prof-uuid-123',
  username: 'professor@oeplan.com',
  first_name: 'Maria',
  last_name: 'Silva',
  email: 'professor@oeplan.com',
  role: 'Professor',
};

const MOCK_ADMIN_USER: User = {
  uuid: 'mock-admin-uuid-456',
  username: 'admin@gmail.com', // Mantido como gmail para corresponder ao uso inicial
  first_name: 'Admin',
  last_name: 'OEPlan',
  email: 'admin@gmail.com',
  role: 'Administrador',
};

// Estado reativo para o usuário logado, token, loading e erro.
// Estes são singletons devido à forma como os composables do Vue funcionam.
const loggedInUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null); // Este erro é para erros gerais de autenticação

export function useAuth() {
  // A inicialização do estado de autenticação (ex: carregar do localStorage)
  // deve ser feita preferencialmente por um plugin Nuxt (ex: plugins/auth.client.ts)
  // para garantir que ocorra no momento certo do ciclo de vida da aplicação.

  const isAuthenticated = computed(() => !!loggedInUser.value && !!authToken.value);

  const setAuthData = (userData: User, tokenData: string) => {
    loggedInUser.value = userData;
    authToken.value = tokenData;
    if (process.client) {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.setItem('authToken', tokenData);
    }
    error.value = null; // Limpa o erro global de auth em caso de sucesso
  };

  const clearAuthData = () => {
    loggedInUser.value = null;
    authToken.value = null;
    if (process.client) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('authToken');
    }
  };

  // Função para inicializar o estado de autenticação
  // Chamada pelo plugin auth.client.ts
  async function initializeAuth() {
    console.log(`[AuthV2] initializeAuth chamada. Mock: ${USE_MOCK_BACKEND}. Client: ${process.client}`);
    if (!process.client) return;

    if (USE_MOCK_BACKEND) {
        const localToken = localStorage.getItem('authToken');
        const localUserStr = localStorage.getItem('loggedInUser');
        if (localToken && localUserStr) {
            try {
                const localUser = JSON.parse(localUserStr) as User;
                // Valida se o usuário local é um dos usuários mockados conhecidos
                if ((localUser.email === MOCK_PROFESSOR_USER.email || localUser.email === MOCK_ADMIN_USER.email)) {
                    loggedInUser.value = localUser; // Restaura o usuário
                    authToken.value = localToken;   // Restaura o token
                } else {
                    // Se o usuário armazenado não for reconhecido, limpa os dados.
                    console.warn("[AuthV2] Usuário local não reconhecido, limpando dados de auth.");
                    clearAuthData();
                }
            } catch (e) {
                console.error("[AuthV2] Erro ao parsear usuário do localStorage:", e);
                clearAuthData();
            }
        } else {
            // Se não houver token ou usuário no localStorage, garante que o estado esteja limpo.
            clearAuthData();
        }
    } else {
      // Lógica para backend real (se aplicável no futuro)
      // Ex: validar token com o backend, buscar dados do usuário
      // Se o token for inválido ou não existir, chamar clearAuthData()
      console.log("[AuthV2] Lógica de backend real para initializeAuth não implementada.");
      // clearAuthData(); // Exemplo se não houver token válido
    }
  }

  async function requestMagicLink(email: string): Promise<MagicLinkRequestResponse> {
    isLoading.value = true;
    error.value = null; // Limpa erro global de auth
    let response: MagicLinkRequestResponse;

    if (USE_MOCK_BACKEND) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
      if (email === MOCK_PROFESSOR_USER.email || email === MOCK_ADMIN_USER.email) {
        response = { success: true, message: `Link mágico (simulado) enviado para ${email}. Use o token: 'mock_magic_token_for_${email.split('@')[0]}'` };
      } else {
        const errorMessage = 'E-mail não encontrado (mock).';
        error.value = errorMessage; // Define erro global de auth
        response = { success: false, message: errorMessage };
      }
    } else {
      // Lógica real de backend aqui
      response = { success: false, message: "Backend real para Magic Link não implementado." };
      error.value = response.message ?? null;
    }
    isLoading.value = false;
    return response;
  }

  async function loginWithMagicLinkToken(token: string): Promise<MagicLinkVerifyResponse> {
    isLoading.value = true;
    error.value = null;
    let response: MagicLinkVerifyResponse;

    if (USE_MOCK_BACKEND) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay
      let foundUser: User | undefined = undefined;
      if (token === `mock_magic_token_for_${MOCK_PROFESSOR_USER.email.split('@')[0]}`) {
        foundUser = MOCK_PROFESSOR_USER;
      } else if (token === `mock_magic_token_for_${MOCK_ADMIN_USER.email.split('@')[0]}`) {
        foundUser = MOCK_ADMIN_USER;
      }

      if (foundUser) {
        setAuthData(foundUser, `jwt_mock_token_${foundUser.role.toLowerCase()}_${Date.now()}`);
        response = { success: true, user: foundUser, message: 'Login com Magic Link (simulado) bem-sucedido!' };
      } else {
        const errorMessage = 'Token de Magic Link inválido (mock).';
        error.value = errorMessage;
        clearAuthData();
        response = { success: false, message: errorMessage };
      }
    } else {
      // Lógica real de backend aqui
      response = { success: false, message: "Backend real para verificar Magic Link não implementado." };
      error.value = response.message ?? null;
      clearAuthData();
    }
    isLoading.value = false;
    return response;
  }

  async function loginAdmin(credentials: UserLogin): Promise<LoginResponse> {
    isLoading.value = true;
    error.value = null; // Limpa o erro global de auth no início da tentativa de login
    let response: LoginResponse;

    if (USE_MOCK_BACKEND) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da rede
      if (credentials.username === MOCK_ADMIN_USER.email && credentials.password === 'admin123') {
        setAuthData(MOCK_ADMIN_USER, `jwt_mock_token_admin_${Date.now()}`);
        response = { success: true, user: MOCK_ADMIN_USER, message: 'Login de Admin (simulado) bem-sucedido!' };
      } else {
        const errorMessage = 'Credenciais inválidas (mock).';
        // error.value = errorMessage; // O erro específico da tentativa de login é retornado na mensagem da resposta.
                                 // O 'error.value' global pode ser usado para erros mais genéricos de auth.
        clearAuthData(); // Garante que nenhum estado de login persista se as credenciais estiverem erradas.
        response = { success: false, message: errorMessage };
      }
    } else {
      // Lógica para backend real aqui
      // Ex: const apiResponse = await $fetch('/api/login', { method: 'POST', body: credentials });
      // if (apiResponse.success) { ... } else { ... }
      const errorMessage = "Backend real para login de Admin não implementado.";
      error.value = errorMessage; // Define o erro global de auth
      clearAuthData();
      response = { success: false, message: errorMessage };
    }
    isLoading.value = false;
    return response;
  }

  async function logout() {
    isLoading.value = true;
    // Não há necessidade de definir error.value aqui, pois o logout geralmente não falha.
    // Se houvesse uma chamada de API para invalidar o token no backend,
    // o tratamento de erro seria relevante.
    clearAuthData();
    isLoading.value = false;
    if (process.client) {
      // Redireciona para a página de login após o logout.
      // O middleware 'authenticated' também pode ajudar a lidar com redirecionamentos
      // se o usuário tentar acessar páginas protegidas sem estar logado.
      await navigateTo('/login');
    }
  }

  // REMOVIDO: A chamada initializeAuth() não deve estar aqui,
  // pois o plugin auth.client.ts já cuida disso.
  // if (process.client) {
  //   initializeAuth();
  // }

  return {
    loggedInUser,
    authToken,
    isAuthenticated,
    isLoading,
    error, // Este é o erro global de autenticação
    requestMagicLink,
    loginWithMagicLinkToken,
    loginAdmin,
    logout,
    initializeAuth, // Exporta para ser usado pelo plugin
  };
}
