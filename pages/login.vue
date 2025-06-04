<template>
  <v-container fluid class="login-container pa-0">
    <v-row align="center" justify="center" class="fill-height ma-0">
      <!-- Painel Esquerdo com Logo e Título (Visível em telas médias e maiores) -->
      <v-col cols="12" md="7" class="d-none d-md-flex align-center justify-center left-pane">
        <div class="text-center pa-8">
          <!-- Certifique-se que o caminho para o logo está correto ou use um import -->
          <img src="/assets/icons/logo.svg" alt="Logo OEPlan" style="width: 100px; height: auto; margin-bottom: 24px;" />
          <h1 class="text-h4 font-weight-bold mb-3" style="color: white;">OEPlan</h1>
          <p class="text-subtitle-1" style="color: #e0e0e0; max-width: 400px; margin: 0 auto;">
            Sistema para Gerenciamento de Atividades Docentes
          </p>
        </div>
      </v-col>

      <!-- Painel Direito com Formulário de Login -->
      <v-col cols="12" md="5" class="d-flex align-center justify-center right-pane">
        <v-card class="pa-6 pa-md-8" elevation="12" max-width="450" width="100%" rounded="lg">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            Login
          </v-card-title>
          <v-card-text>
            <!-- Mensagem de erro de login -->
            <v-alert
              v-if="loginErrorMessage"
              type="error"
              density="compact"
              class="mb-4"
              variant="tonal"
            >
              {{ loginErrorMessage }}
            </v-alert>

            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                required
                autocomplete="username"
                class="mb-4"
                color="primary"
                :error-messages="emailErrors"
                @blur="validateEmail"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                required
                autocomplete="current-password"
                class="mb-2"
                color="primary"
                :error-messages="passwordErrors"
                @blur="validatePassword"
              ></v-text-field>

              <div class="text-right mb-5">
                <a href="#" class="text-caption text-primary font-weight-medium" style="text-decoration: none;">Esqueceu a senha?</a>
              </div>

              <v-btn
                type="submit"
                block
                color="primary"
                size="large"
                :loading="isLoading" 
                class="mb-4"
              >
                Entrar
              </v-btn>
            </v-form>
            <div class="text-center">
                <p class="text-body-2 mt-2">
                Ou entre com
                <NuxtLink to="/magic-link" class="text-primary font-weight-medium" style="text-decoration: none;">Magic Link</NuxtLink>
              </p>
              <p class="text-caption mt-6">
                Precisa de ajuda? <a href="#" class="text-primary" style="text-decoration: none;">Entre em contato</a>
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// useRouter é importado de 'vue-router' no Nuxt 3, mas o Nuxt provê `useRouter()` globalmente.
// Se estiver usando Nuxt 3, `useRouter()` já está disponível.
// import { useRouter } from 'vue-router'; // Não é necessário importar explicitamente no Nuxt 3
import { useAuth } from '~/composables/auth'; // Caminho para seu composable de autenticação
import type { UserLogin } from '~/shared/types/auth/user-login'; // Tipo para as credenciais

definePageMeta({
  layout: false, // Use o layout padrão ou defina como false se não quiser layout
});
useHead({
  title: 'Login - OEPlan',
});

const email = ref('admin@gmail.com'); // Email padrão para facilitar testes
const password = ref('admin123'); // Senha padrão (deixe vazia ou coloque 'admin123' para teste)
const loginErrorMessage = ref<string | null>(null); // Para exibir mensagens de erro na UI
const emailErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);

const router = useRouter();
// Corrigido para usar loginAdmin e isLoading do composable
const { loginAdmin, isLoading } = useAuth();

// Validação simples (pode ser expandida com Zod ou Yup se necessário)
function validateEmail() {
  emailErrors.value = [];
  if (!email.value) {
    emailErrors.value.push('O e-mail é obrigatório.');
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailErrors.value.push('Formato de e-mail inválido.');
  }
}

function validatePassword() {
  passwordErrors.value = [];
  if (!password.value) {
    passwordErrors.value.push('A senha é obrigatória.');
  }
}

async function onSubmit() {
  loginErrorMessage.value = null; // Limpa erros anteriores
  validateEmail();
  validatePassword();

  if (emailErrors.value.length > 0 || passwordErrors.value.length > 0) {
    return; // Interrompe se houver erros de validação
  }

  // isLoading já é um ref do useAuth, não precisa de .value aqui para atribuir
  // loading.value = true; // useAuth().isLoading.value será alterado dentro de loginAdmin

  try {
    const credentials: UserLogin = {
      username: email.value,
      password: password.value,
    };
    const response = await loginAdmin(credentials); // Chama a função correta

    if (response.success) {
      // Redireciona para o dashboard ou outra página após o login bem-sucedido
      // router.push('/dashboard'); // Exemplo
      await navigateTo('/dashboard'); // Use navigateTo no Nuxt 3
    } else {
      // Exibe a mensagem de erro retornada pela função de login
      loginErrorMessage.value = response.message || 'Utilizador ou senha inválidos.';
    }
  } catch (error: any) {
    console.error("Erro no login:", error);
    // Exibe uma mensagem de erro genérica para erros inesperados
    loginErrorMessage.value = 'Ocorreu um erro inesperado durante o login. Tente novamente.';
  } finally {
    // isLoading.value = false; // O isLoading é controlado dentro do useAuth
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100vw; /* Garante que o container ocupe toda a largura */
  background-color: #0e1321; /* Cor de fundo unificada para evitar piscar */
}
.fill-height {
  min-height: 100vh;
}
.left-pane {
  background-color: #04060f; /* Cor de fundo escura do seu design original */
  min-height: 100vh; /* Garante que o painel esquerdo ocupe toda a altura */
  display: flex; /* Adicionado para centralização */
  align-items: center; /* Adicionado para centralização */
  justify-content: center; /* Adicionado para centralização */
}
.right-pane {
  background-color: #0e1321; /* Cor de fundo um pouco mais clara */
  min-height: 100vh; /* Garante que o painel direito ocupe toda a altura */
  padding: 16px;
  display: flex; /* Adicionado para centralização */
  align-items: center; /* Adicionado para centralização */
  justify-content: center; /* Adicionado para centralização */
}
.v-card {
  background-color: rgb(var(--v-theme-surface)); /* Usa a cor de superfície do tema Vuetify */
}
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Estilo para a mensagem de erro */
.error-message {
  color: red;
  margin-bottom: 1rem;
}
</style>
