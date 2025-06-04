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
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2" title="Menu do Usuário">
          <v-avatar color="primary" size="36">
            <!-- Pode ser a inicial do usuário ou uma imagem -->
            <span class="white--text text-subtitle-1">{{ userInitials }}</span>
            <!-- <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=U" alt="Avatar"> -->
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
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { useAuth } from '~/composables/auth'; // Seu composable de autenticação
import { useRouter } from 'vue-router';

const emit = defineEmits(['toggleNavigationDrawer']);
const theme = useTheme();
const router = useRouter();
const { state: authState, logout } = useAuth(); // Assumindo que seu useAuth expõe 'state' e 'logout'

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const userInitials = computed(() => {
  const user = authState.value.user;
  if (user && user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  return 'U'; // Padrão
});

const handleLogout = async () => {
  await logout();
  router.push('/login'); // Ou sua página de login
};
</script>

<style scoped>
.search-field {
  max-width: 300px; /* Limita a largura do campo de pesquisa */
}
.primary--text {
  color: rgb(var(--v-theme-primary));
}
.white--text {
  color: rgb(var(--v-theme-on-primary)); /* Cor de texto para usar sobre a cor primária */
}
</style>
