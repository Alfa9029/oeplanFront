// composables/auth.ts
import { ref, computed } from 'vue'; // Removido onMounted que não estava a ser usado aqui
// Update the path below to the correct relative path if needed
import type { User } from '../shared/types/auth/user';
import type { UserLogin } from '../shared/types/auth/user-login';
import type { UserRegister } from '../shared/types/auth/user-register';

interface AuthState {
  isLoggedIn: boolean;
  user?: User;
  token?: string | null;
  error?: string | null;
  loading: boolean;
}

// Estado global reativo para autenticação
const authState = ref<AuthState>({
  isLoggedIn: false,
  user: undefined,
  token: null,
  error: null,
  loading: false,
});

// Mock de utilizadores para simulação
const MOCK_ADMIN_USER: User = {
  uuid: 'mock-admin-uuid',
  username: 'admin@gmail.com',
  first_name: 'Admin',
  last_name: 'OEPlan',
  email: 'admin@gmail.com',
  role: 'Administrador',
};

const MOCK_PROFESSOR_USER: User = {
  uuid: 'mock-prof-uuid',
  username: 'professor@example.com',
  first_name: 'Professor',
  last_name: 'Teste',
  email: 'professor@example.com',
  role: 'Professor',
};

export const useAuth = () => {
  // Função interna para limpar o estado de autenticação
  const _clearState = () => {
    authState.value = {
      isLoggedIn: false,
      user: undefined,
      token: null,
      error: null,
      loading: false,
    };
    // Limpa o cookie de sessão simulado se estiver no cliente
    if (process.client) {
        const sessionCookie = useCookie('mock-auth-session');
        sessionCookie.value = null; // Usa null para limpar o cookie
    }
    console.log('[AuthMock] Estado limpo e cookie de sessão simulado removido.');
  };

  // Função de login simulada
  const login = async (credentials: UserLogin): Promise<boolean> => {
    authState.value.loading = true;
    authState.value.error = null;
    console.log('[AuthMock] A tentar login com:', credentials);

    // Simula um atraso de API
    await new Promise(resolve => setTimeout(resolve, 700));

    let loginSuccess = false;
    let loggedInUser: User | undefined = undefined;

    // Verifica as credenciais contra os utilizadores mockados
    if (credentials.username === MOCK_ADMIN_USER.email && credentials.password === '12345') {
      loggedInUser = MOCK_ADMIN_USER;
      loginSuccess = true;
    } else if (credentials.username === MOCK_PROFESSOR_USER.email && credentials.password === 'password') {
      loggedInUser = MOCK_PROFESSOR_USER;
      loginSuccess = true;
    }

    if (loginSuccess && loggedInUser) {
      const mockToken = `mock-token-for-${loggedInUser.username}-${Date.now()}`;
      authState.value = {
        isLoggedIn: true,
        user: loggedInUser,
        token: mockToken,
        error: null,
        loading: false,
      };
      // Simula a criação de um cookie de sessão no cliente
      if (process.client) {
        const sessionCookie = useCookie('mock-auth-session', { maxAge: 60 * 60 * 24 * 7 }); // Cookie válido por 7 dias
        sessionCookie.value = mockToken;
      }
      console.log('[AuthMock] Login bem-sucedido:', loggedInUser.username);
      return true;
    } else {
      authState.value.error = 'Utilizador ou senha inválidos (mock).';
      authState.value.loading = false;
      console.warn('[AuthMock] Falha no login:', authState.value.error);
      return false;
    }
  };

  // Função de registo simulada
  const register = async (registrationData: UserRegister): Promise<boolean> => {
    authState.value.loading = true;
    authState.value.error = null;
    console.log('[AuthMock] A tentar registar com:', registrationData);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simula sucesso no registo
    console.log('[AuthMock] Registo (simulado) bem-sucedido para:', registrationData.email);
    authState.value.loading = false;
    // Numa aplicação real, poderia redirecionar para login ou logar automaticamente
    return true;
  };

  // Função de envio de magic link simulada
  const sendMagicLink = async (email: string): Promise<boolean> => {
    authState.value.loading = true;
    authState.value.error = null;
    console.log('[AuthMock] A enviar magic link (simulado) para:', email);
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('[AuthMock] Magic link (simulado) enviado com sucesso.');
    authState.value.loading = false;
    return true;
  };

  // Função de logout simulada
  const logout = async () => {
    authState.value.loading = true;
    console.log('[AuthMock] A realizar logout...');
    await new Promise(resolve => setTimeout(resolve, 200));
    _clearState(); // Limpa o estado e o cookie simulado
    console.log('[AuthMock] Logout concluído.');
  };

  // Função para inicializar o estado de autenticação (ex: ao carregar a app)
  const initState = () => {
    if (process.client) { // Executar apenas no cliente
      console.log('[AuthMock] A iniciar estado de autenticação...');
      const sessionCookie = useCookie<string | null>('mock-auth-session');
      if (sessionCookie.value && sessionCookie.value.startsWith('mock-token-for-')) {
        // Extrai o nome de utilizador do token mockado para simular a recuperação dos dados
        const usernameFromToken = sessionCookie.value.split('-')[3];
        let foundUser: User | undefined;
        if (usernameFromToken === MOCK_ADMIN_USER.email) {
            foundUser = MOCK_ADMIN_USER;
        } else if (usernameFromToken === MOCK_PROFESSOR_USER.email) {
            foundUser = MOCK_PROFESSOR_USER;
        }

        if (foundUser) {
            authState.value = {
                isLoggedIn: true,
                user: foundUser,
                token: sessionCookie.value,
                error: null,
                loading: false,
            };
            console.log('[AuthMock] Sessão restaurada para:', foundUser.username);
        } else {
            // Se o token no cookie não corresponder a nenhum utilizador mockado
            console.log('[AuthMock] Token mockado inválido encontrado, a limpar.');
            _clearState();
        }
      } else {
        // Se não houver cookie de sessão simulado válido
        console.log('[AuthMock] Nenhum cookie de sessão simulado válido encontrado.');
        // Pode ser útil garantir que o estado esteja limpo se não houver cookie
        // _clearState(); // Descomente se quiser limpar ativamente o estado se não houver cookie
      }
    }
  };

  // Função para "buscar" o utilizador (usada principalmente para revalidar sessão)
  const fetchUser = async () => {
    // No mock, initState já tenta restaurar a sessão a partir do cookie.
    // Esta função pode ser chamada se for preciso forçar uma verificação do estado.
    if (!authState.value.isLoggedIn && process.client && useCookie('mock-auth-session').value) {
        initState(); // Tenta inicializar se ainda não estiver logado mas houver cookie
    }
    if (!authState.value.isLoggedIn) {
      console.log('[AuthMock] fetchUser chamado, mas utilizador não está logado (ou sessão não restaurada).');
    }
  };

  // Expõe o estado e as funções
  return {
    state: computed(() => authState.value),
    login,
    logout,
    register,
    sendMagicLink,
    fetchUser,
    initState,
  };
};
