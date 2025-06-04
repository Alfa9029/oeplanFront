<template>
  <v-app>
    <!-- Barra de Navegação Lateral (AppSidebar) -->
    <AppSidebar v-model="drawer" />

    <!-- Barra de Aplicativo Superior (AppHeader) -->
    <AppHeader @toggle-navigation-drawer="drawer = !drawer" />

    <!-- Conteúdo Principal da Página -->
    <v-main>
      <v-container fluid class="page-container">
        <slot /> <!-- As páginas serão renderizadas aqui -->
      </v-container>
    </v-main>

    <!-- Rodapé (Opcional) -->
    <!--
    <v-footer app>
      <span>OEPlan &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    -->
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '~/components/AppHeader.vue';
import AppSidebar from '~/components/AppSidebar.vue';

// Controla o estado (aberto/fechado) da barra de navegação lateral
const drawer = ref(true); // Pode ser true (aberto por padrão) ou false, ou null para auto
</script>

<style scoped>
.page-container {
  /* Adiciona um padding padrão às páginas, pode ser ajustado */
  padding: 16px;
  height: 100%; /* Garante que o container principal ocupe a altura disponível */
  background-color: rgb(var(--v-theme-background)); /* Usa a cor de fundo do tema Vuetify */
}

/* Ajustes para o conteúdo principal não ficar sob a app-bar fixa */
/* A v-main do Vuetify geralmente lida com isso, mas pode precisar de ajustes dependendo da altura da app-bar */
</style>
