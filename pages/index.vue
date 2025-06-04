<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
        <p class="text-subtitle-1">A carregar...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/auth'; // Certifique-se que este composable existe

const router = useRouter();
const { state } = useAuth(); // Assumindo que seu useAuth expõe um 'state' com 'isLoggedIn'

onMounted(() => {
  if (state.value.isLoggedIn) {
    router.push('/dashboard');
  } else {
    router.push('/login'); // Ou '/magic-login' como sua página de login padrão
  }
});

definePageMeta({
  layout: 'empty', // Use um layout vazio se não houver header/sidebar nesta página
});

useHead({
  title: 'Bem-vindo ao OEPlan',
});
</script>

<style scoped>
/* Para garantir que o container ocupe toda a altura da viewport */
.v-container.fill-height {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
