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

const loggedInUser = ref<User | null>(null);
const authToken = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  if (process.client) {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedToken) {
      authToken.value = storedToken;
    }
    if (storedUser) {
      try {
        loggedInUser.value = JSON.parse(storedUser);
      } catch (e) {
        localStorage.removeItem('loggedInUser');
      }
    }
  }

  const isAuthenticated = computed(() => !!loggedInUser.value && !!authToken.value);

  const setAuthData = (userData: User, tokenData: string) => {
    loggedInUser.value = userData;
    authToken.value = tokenData;
    if (process.client) {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.setItem('authToken', tokenData);
    }
  };

  const clearAuthData = () => {
    loggedInUser.value = null;
    authToken.value = null;
    if (process.client) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('authToken');
    }
  };

  async function requestMagicLink(email: string): Promise<{ success: boolean; message?: string }> {
    isLoading.value = true;
    error.value = null;
    if (USE_MOCK_BACKEND) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (email === MOCK_PROFESSOR_USER.email || email === MOCK_ADMIN_USER.email) {
            resolve({ success: true, message: `Link (simulado) enviado para ${email}. Use token 'mock_magic_token_for_${email.split('@')[0]}'` });
          } else {
            error.value = 'E-mail não encontrado (mock).';
            resolve({ success: false, message: error.value ?? undefined });
          }
          isLoading.value = false;
        }, 1000);
      });
    } else {
      // Lógica real omitida para brevidade (estava no código anterior)
      return { success: false, message: "Backend real não implementado nesta versão" };
    }
  }

  async function loginWithMagicLinkToken(token: string): Promise<{ success: boolean; user?: User; message?: string }> {
    isLoading.value = true;
    error.value = null;
    if (USE_MOCK_BACKEND) {
      return new Promise(resolve => {
        setTimeout(() => {
          let foundUser: User | undefined = undefined;
          if (token === `mock_magic_token_for_${MOCK_PROFESSOR_USER.email.split('@')[0]}`) {
            foundUser = MOCK_PROFESSOR_USER;
          } else if (token === `mock_magic_token_for_${MOCK_ADMIN_USER.email.split('@')[0]}`) {
            foundUser = MOCK_ADMIN_USER;
          }

          if (foundUser) {
            setAuthData(foundUser, `jwt_mock_token_${foundUser.role.toLowerCase()}_${Date.now()}`);
            resolve({ success: true, user: foundUser, message: 'Login Magic Link (simulado) OK!' });
          } else {
            error.value = 'Token inválido (mock).';
            clearAuthData();
            resolve({ success: false, message: error.value ?? undefined });
          }
          isLoading.value = false;
        }, 1500);
      });
    } else {
      // Lógica real omitida
      return { success: false, message: "Backend real não implementado nesta versão" };
    }
  }

  async function loginAdmin(credentials: UserLogin): Promise<{ success: boolean; user?: User; message?: string }> {
    isLoading.value = true;
    error.value = null;
    if (USE_MOCK_BACKEND) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (credentials.username === MOCK_ADMIN_USER.email && credentials.password === 'admin123') {
            setAuthData(MOCK_ADMIN_USER, `jwt_mock_token_admin_${Date.now()}`);
            resolve({ success: true, user: MOCK_ADMIN_USER, message: 'Login Admin (simulado) OK!' });
          } else {
            error.value = 'Credenciais inválidas (mock).';
            clearAuthData();
            resolve({ success: false, message: error.value ?? undefined });
          }
          isLoading.value = false;
        }, 1000);
      });
    } else {
      // Lógica real omitida
      return { success: false, message: "Backend real não implementado nesta versão" };
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    // Lógica de logout omitida para brevidade (estava no código anterior)
    clearAuthData();
    isLoading.value = false;
    if (process.client) await navigateTo('/login');
  }

  async function initializeAuth() {
    // Esta é a versão que tinha a chamada automática no final do composable
    // e uma lógica de inicialização mais simples.
    console.log(`[AuthV1] initializeAuth chamada. Mock: ${USE_MOCK_BACKEND}. Client: ${process.client}`);
    if (!process.client) return;

    if (USE_MOCK_BACKEND) {
        const localToken = localStorage.getItem('authToken');
        const localUserStr = localStorage.getItem('loggedInUser');
        if (localToken && localUserStr) {
            try {
                const localUser = JSON.parse(localUserStr) as User;
                if ((localUser.email === MOCK_PROFESSOR_USER.email || localUser.email === MOCK_ADMIN_USER.email)) {
                    loggedInUser.value = localUser;
                    authToken.value = localToken;
                } else { clearAuthData(); }
            } catch (e) { clearAuthData(); }
        } else { clearAuthData(); }
    } else {
      // Lógica real omitida
    }
  }

  // Chamada automática que foi removida posteriormente
  if (process.client) {
    initializeAuth();
  }

  return {
    loggedInUser,
    authToken,
    isAuthenticated,
    isLoading,
    error,
    requestMagicLink,
    loginWithMagicLinkToken,
    loginAdmin,
    logout,
    initializeAuth,
  };
}
