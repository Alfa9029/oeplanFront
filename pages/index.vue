<template>
  <v-container>
    <div v-if="isAuthenticated && loggedInUser">
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4 rounded-lg">
            <v-card-title class="text-h5 font-weight-bold">
              Bem-vindo(a) de volta, {{ loggedInUser.first_name }}!
            </v-card-title>
            <v-card-subtitle>
              Este é o seu painel de gerenciamento de atividades.
            </v-card-subtitle>
            <v-card-text>
              <p><strong>Nome Completo:</strong> {{ loggedInUser.first_name }} {{ loggedInUser.last_name }}</p>
              <p><strong>E-mail:</strong> {{ loggedInUser.email }}</p>
              <p><strong>Função:</strong> {{ loggedInUser.role }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleLogout" :loading="isLoading">
                <v-icon left class="mr-2">mdi-logout</v-icon>
                Logout
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col cols="12">
           <v-card class="pa-4 rounded-lg">
             <v-card-title class="text-subtitle-1">
               Informações de Debug (Estado de Autenticação)
             </v-card-title>
              <v-card-text>
                <p><strong>Está Autenticado?</strong> {{ isAuthenticated }}</p>
                <p><strong>Token:</strong> <span class="text-caption">{{ authToken }}</span></p>
                <p><strong>Objeto User:</strong></p>
                <pre class="code-block">{{ JSON.stringify(loggedInUser, null, 2) }}</pre>
              </v-card-text>
           </v-card>
        </v-col>
      </v-row>
      </div>

    <div v-else class="text-center pa-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">Carregando...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth'; // Verifique o caminho
import { useRouter } from 'vue-router';

// Aplica o middleware de autenticação para proteger esta página
definePageMeta({
  middleware: ['authenticated']
});

const { loggedInUser, isAuthenticated, authToken, logout, isLoading } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  // A função logout no composable já redireciona para /login
  // router.push('/login'); // Redirecionamento de fallback se necessário
};

useHead({
  title: 'Dashboard - OEPlan',
});
</script>

<style scoped>
.code-block {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 12px;
}
</style>
