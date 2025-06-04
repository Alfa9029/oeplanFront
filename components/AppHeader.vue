<template>
  <v-app-bar app color="surface" elevation="2">
    <v-app-bar-nav-icon @click="$emit('toggleNavigationDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-title class="font-weight-bold primary--text">OEPlan</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme" title="Alternar Tema">
      <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <v-btn icon title="Notificações">
      <v-badge content="3" color="error" dot overlap> <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>

    <v-menu v-if="isAuthenticated" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2" title="Menu do Usuário">
          <v-avatar color="primary" size="36">
            <span v-if="userInitials" class="white--text text-subtitle-1">{{ userInitials }}</span>
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
import { useAuth } from '~/composables/auth';

const emit = defineEmits(['toggleNavigationDrawer']);
const theme = useTheme();
const { loggedInUser, isAuthenticated, logout } = useAuth();

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  if (process.client) {
    localStorage.setItem('themePreference', theme.global.name.value);
  }
};

const userInitials = computed(() => {
  const user = loggedInUser.value;
  if (user && user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  return null;
});

const handleLogout = async () => {
  await logout();
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
.search-field { /* Este estilo não é mais necessário, mas pode deixar ou remover */
  max-width: 300px;
}
.primary--text {
  color: rgb(var(--v-theme-primary));
}
.white--text {
  color: rgb(var(--v-theme-on-primary));
}
</style>
