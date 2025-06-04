<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h5">Página de Ajuda</h1>
        <p>
          Bem-vindo à seção de ajuda.
        </p>
        <p class="mt-4">
          Consulte a documentação ou entre em contato com o suporte.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Nenhuma lógica de script complexa por enquanto, apenas o básico do Nuxt.

// Define metadados da página, como o layout a ser usado.
definePageMeta({
  layout: 'default', // Certifique-se de que você tem 'layouts/default.vue'
  middleware: ['authenticated'] // Se esta página requer que o usuário esteja logado
});

// Define o título da página que aparecerá na aba do navegador.
useHead({
  title: 'Ajuda - OEPlan',
});
</script>

<style scoped>
/* Estilos mínimos, se necessário. Vuetify cuidará da maior parte. */
.mt-4 {
  margin-top: 16px;
}
</style>
