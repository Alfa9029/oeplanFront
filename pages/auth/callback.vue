<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg pa-6 text-center">
          <v-card-title class="text-h5 justify-center mb-4">
            <v-icon v-if="status === 'verifying'" color="primary" class="mr-2">mdi-sync mdi-spin</v-icon>
            <v-icon v-if="status === 'success'" color="success" class="mr-2">mdi-check-circle-outline</v-icon>
            <v-icon v-if="status === 'error'" color="error" class="mr-2">mdi-alert-circle-outline</v-icon>
            {{ titleMessage }}
          </v-card-title>

          <v-card-text>
            <p class="mb-6">{{ statusMessage }}</p>

            <v-progress-circular
              v-if="status === 'verifying'"
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            ></v-progress-circular>

            <v-btn
              v-if="status === 'error'"
              color="primary"
              @click="goToLogin"
              class="mt-4 rounded-lg"
              size="large"
            >
              <v-icon left class="mr-2">mdi-arrow-left</v-icon>
              Tentar Novamente
            </v-btn>

             <v-btn
              v-if="status === 'success'"
              color="primary"
              @click="goToDashboard"
              class="mt-4 rounded-lg"
              size="large"
            >
              <v-icon left class="mr-2">mdi-view-dashboard-outline</v-icon>
              Ir para o Painel
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // ou '#app' para Nuxt 3
// Se estiver usando o composable de autenticação
// import { useAuth } from '~/composables/auth'; // Ajuste o caminho se necessário
// import type { User } from '~/shared/types/auth/user'; // Ajuste o caminho

// Definição do layout (se você tiver um layout específico para autenticação)
definePageMeta({ // Ou o nome do seu layout de autenticação, se houver. Senão, pode remover.
});

const route = useRoute();
const router = useRouter();
// const { loginWithMagicLinkToken, loggedInUser } = useAuth(); // Descomente quando usar o composable real

const status = ref<'verifying' | 'success' | 'error'>('verifying');
const titleMessage = ref('Verificando Acesso');
const statusMessage = ref('Aguarde enquanto validamos seu link de acesso...');

// Simulação da interface User
interface User {
  id: string;
  name: string;
  email: string;
}

// Simulação da função do composable/auth.ts
async function mockLoginWithMagicLinkToken(token: string): Promise<{ success: boolean; user?: User; error?: string }> {
  console.log(`Verificando magic link token: ${token}`);
  // Simula uma chamada de API
  return new Promise(resolve => {
    setTimeout(() => {
      if (token === 'valid_token') {
        resolve({ success: true, user: { id: '1', name: 'Usuário Teste', email: 'teste@example.com' } });
      } else if (token === 'expired_token') {
        resolve({ success: false, error: 'Link expirado. Por favor, solicite um novo.' });
      } else {
        resolve({ success: false, error: 'Link inválido ou já utilizado.' });
      }
    }, 2000);
  });
}


onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    titleMessage.value = 'Erro de Acesso';
    statusMessage.value = 'Token de acesso não encontrado. Por favor, utilize o link enviado para o seu e-mail.';
    status.value = 'error';
    return;
  }

  try {
    // No seu projeto real, você chamaria:
    // const result = await loginWithMagicLinkToken(token);
    const result = await mockLoginWithMagicLinkToken(token); // Usando o mock

    if (result.success && result.user) {
      titleMessage.value = 'Acesso Concedido!';
      statusMessage.value = `Bem-vindo(a) de volta, ${result.user.name}! Você será redirecionado em instantes.`;
      status.value = 'success';
      // loggedInUser.value = result.user; // Atualiza o estado global do usuário

      // Redireciona para o painel principal após um breve delay
      setTimeout(() => {
        router.push('/'); // Ou a rota do seu painel principal
      }, 3000);
    } else {
      titleMessage.value = 'Falha na Autenticação';
      statusMessage.value = result.error || 'Não foi possível validar seu link de acesso. Tente solicitar um novo.';
      status.value = 'error';
    }
  } catch (err: any) {
    console.error('Erro ao verificar magic link token:', err);
    titleMessage.value = 'Erro no Servidor';
    statusMessage.value = err.data?.message || err.message || 'Ocorreu um problema ao tentar validar seu acesso. Tente novamente mais tarde.';
    status.value = 'error';
  }
});

const goToLogin = () => {
  router.push('/login'); // Ou a rota da sua página de solicitação de magic link
};

const goToDashboard = () => {
  router.push('/'); // Ou a rota do seu painel principal
};

// Metadata da página (SEO)
useHead({
  title: 'Verificando Acesso OEPlan',
  meta: [
    { name: 'description', content: 'Página de verificação do link mágico para acesso ao OEPlan.' }
  ],
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
/* Adicione estilos globais em assets/css/global.css se necessário */
</style>
