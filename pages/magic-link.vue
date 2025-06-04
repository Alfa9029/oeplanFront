<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg pa-4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center flex-grow-1">
              Acesso OEPlan
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-6">
            <p class="text-center mb-6">
              Insira seu e-mail abaixo para receber um link de acesso mágico.
            </p>
            <v-form ref="form" v-model="isValidForm" @submit.prevent="handleRequestMagicLink">
              <v-text-field
                v-model="email"
                label="E-mail"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                :rules="emailRules"
                required
                variant="outlined"
                class="mb-4"
                color="primary"
              ></v-text-field>

              <v-alert
                v-if="message"
                :type="messageType"
                dense
                outlined
                class="mb-4"
              >
                {{ message }}
              </v-alert>

              <v-btn
                :loading="loading"
                :disabled="!isValidForm || loading"
                block
                color="primary"
                size="large"
                type="submit"
                class="rounded-lg"
              >
                <v-icon left class="mr-2">mdi-send-outline</v-icon>
                Enviar Link de Acesso
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pa-4">
             <NuxtLink to="/" class="text-decoration-none text-primary">
                Voltar para o Início
              </NuxtLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // ou '#app' para Nuxt 3

// Se estiver usando o composable de autenticação
// import { useAuth } from '~/composables/auth'; // Ajuste o caminho se necessário

// Definição do layout (se você tiver um layout específico para login)
definePageMeta({
  layout: 'auth', // Ou o nome do seu layout de autenticação, se houver. Senão, pode remover.
  middleware: ['guest'] // Exemplo: se tiver um middleware para redirecionar usuários já logados
});

const email = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');
const isValidForm = ref(false);
const form = ref<any>(null); // Para referenciar o v-form

const router = useRouter();

// Regras de validação para o e-mail
const emailRules = [
  (v: string) => !!v || 'E-mail é obrigatório.',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido.',
];

// Simulação da função do composable/auth.ts
// No seu projeto real, você importaria e usaria a função do seu composable.
async function mockRequestMagicLink(emailAddress: string): Promise<{ success: boolean; error?: string }> {
  console.log(`Solicitando magic link para: ${emailAddress}`);
  // Simula uma chamada de API
  return new Promise(resolve => {
    setTimeout(() => {
      if (emailAddress === 'error@example.com') {
        resolve({ success: false, error: 'Este e-mail está bloqueado.' });
      } else if (emailAddress.includes('@')) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'E-mail inválido fornecido para mock.' });
      }
    }, 1500);
  });
}

const handleRequestMagicLink = async () => {
  // Valida o formulário antes de prosseguir
  const { valid } = await form.value?.validate();
  if (!valid) {
    message.value = 'Por favor, corrija os erros no formulário.';
    messageType.value = 'error';
    return;
  }

  loading.value = true;
  message.value = ''; // Limpa mensagens anteriores

  try {
    // No seu projeto real, você chamaria:
    // const { success, error } = await useAuth().requestMagicLink(email.value);
    const { success, error } = await mockRequestMagicLink(email.value); // Usando o mock

    if (success) {
      message.value = 'Link de acesso enviado! Por favor, verifique sua caixa de entrada e pasta de spam.';
      messageType.value = 'success';
      email.value = ''; // Limpa o campo de e-mail após o sucesso
      form.value?.resetValidation(); // Reseta a validação do formulário
    } else {
      message.value = error || 'Ocorreu um erro ao solicitar o link. Tente novamente.';
      messageType.value = 'error';
    }
  } catch (err: any) {
    console.error('Erro ao solicitar magic link:', err);
    message.value = err.data?.message || err.message || 'Falha na comunicação com o servidor. Tente mais tarde.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

// Metadata da página (SEO)
useHead({
  title: 'Acesso OEPlan',
  meta: [
    { name: 'description', content: 'Acesse o OEPlan utilizando seu e-mail para receber um link mágico.' }
  ],
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
/* Você pode adicionar estilos globais em assets/css/global.css */
</style>
