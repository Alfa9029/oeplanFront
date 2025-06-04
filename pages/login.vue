<template>
  <v-container fluid class="login-container pa-0">
    <v-row align="center" justify="center" class="fill-height ma-0">
      <!-- Painel Esquerdo com Logo e Título (Visível em telas médias e maiores) -->
      <v-col cols="12" md="7" class="d-none d-md-flex align-center justify-center left-pane">
        <div class="text-center pa-8">
          <img src="assets/icons/logo.svg" alt="Logo OEPlan" style="width: 100px; height: auto; margin-bottom: 24px;" />
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
              ></v-text-field>

              <div class="text-right mb-5">
                <a href="#" class="text-caption text-primary font-weight-medium" style="text-decoration: none;">Esqueceu a senha?</a>
              </div>

              <v-btn
                type="submit"
                block
                color="primary"
                size="large"
                :loading="loading"
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
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/auth';

definePageMeta({
  layout: 'empty', // Layout sem header/sidebar padrão
});
useHead({
  title: 'Login - OEPlan',
});

const email = ref('admin@gmail.com');
const password = ref('12345');
const loading = ref(false);
const router = useRouter();
const { login } = useAuth(); // Certifique-se que este composable está criado e funcionando

async function onSubmit() {
  loading.value = true;
  try {
    const loginSuccess = await login({ username: email.value, password: password.value });
    if (loginSuccess) {
      router.push('/dashboard');
    } else {
      // Exibir erro de forma mais elegante no futuro
      alert('Utilizador ou senha inválidos');
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert('Ocorreu um erro durante o login.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100vw; /* Garante que o container ocupe toda a largura */
}
.fill-height {
  min-height: 100vh;
}
.left-pane {
  background-color: #04060f; /* Cor de fundo escura do seu design original */
  min-height: 100vh;
}
.right-pane {
  background-color: #0e1321; /* Cor de fundo um pouco mais clara */
  min-height: 100vh;
  padding: 16px;
}
.v-card {
  background-color: rgb(var(--v-theme-surface)); /* Usa a cor de superfície do tema Vuetify */
}
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>