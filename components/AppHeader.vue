<template>
  <v-app-bar app color="surface" elevation="2">
    <!-- Ícone para abrir/fechar a barra de navegação lateral em telas menores -->
    <v-app-bar-nav-icon @click="$emit('toggleNavigationDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-title class="font-weight-bold primary--text">OEPlan</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Campo de Pesquisa (Opcional, pode ser mais complexo) -->
    <v-text-field
      density="compact"
      variant="solo-filled"
      label="Pesquisar..."
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
      flat
      class="mx-4 search-field"
    ></v-text-field>

    <!-- Botão de Alternar Tema -->
    <v-btn icon @click="toggleTheme" title="Alternar Tema">
      <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- Botão de Notificações -->
    <v-btn icon title="Notificações">
      <v-badge content="3" color="error" dot overlap> <!-- Exemplo de badge -->
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>

    <!-- Menu do Usuário -->
    <!-- Renderiza o menu apenas se o usuário estiver autenticado -->
    <v-menu v-if="isAuthenticated" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2" title="Menu do Usuário">
          <v-avatar color="primary" size="36">
            <!-- Exibe as iniciais do usuário se disponíveis -->
            <span v-if="userInitials" class="white--text text-subtitle-1">{{ userInitials }}</span>
            <!-- Ícone padrão caso as iniciais não estejam disponíveis -->
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list density="compact" nav>
        <v-list-item @click="navigateTo('/profile')" prepend-icon="mdi-account-circle-outline" title="Meu Perfil"></v-list-item>
        <v-list-item @click="navigateTo('/settings')" prepend-icon="mdi-cog-outline" title="Configurações"></v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Sair" base-color="error"></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useAuth } from '~/composables/auth'; // Seu composable de autenticação
// useRouter e navigateTo são auto-importados no Nuxt 3

const emit = defineEmits(['toggleNavigationDrawer']);
const theme = useTheme();
// const router = useRouter(); // Não é estritamente necessário se usar navigateTo

// Corrigido: Obtém loggedInUser, isAuthenticated e logout diretamente do useAuth
const { loggedInUser, isAuthenticated, logout } = useAuth();

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  // Opcional: Salvar preferência de tema no localStorage
  if (process.client) {
    localStorage.setItem('themePreference', theme.global.name.value);
  }
};

// Propriedade computada para as iniciais do usuário
const userInitials = computed(() => {
  // Acessa loggedInUser.value para obter o objeto do usuário
  const user = loggedInUser.value;
  if (user && user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  // Retorna null ou um valor padrão se o usuário não estiver logado ou não tiver nome/sobrenome
  // Isso evita o erro ao tentar acessar propriedades de 'undefined'
  return null; // Ou 'U' como padrão se preferir sempre mostrar algo no avatar
});

const handleLogout = async () => {
  await logout();
  // Usa navigateTo para redirecionamento no Nuxt 3
  await navigateTo('/login');
};

// Opcional: Carregar preferência de tema ao montar o componente
// if (process.client) {
//   const savedTheme = localStorage.getItem('themePreference');
//   if (savedTheme) {
//     theme.global.name.value = savedTheme;
//   }
// }
</script>

<style scoped>
.search-field {
  max-width: 300px; /* Limita a largura do campo de pesquisa */
}
.primary--text { /* Para o título OEPlan */
  color: rgb(var(--v-theme-primary));
}
.white--text { /* Para as iniciais no avatar */
  color: rgb(var(--v-theme-on-primary)); /* Cor de texto para usar sobre a cor primária do tema */
}
</style>
