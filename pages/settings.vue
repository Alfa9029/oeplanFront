<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Configurações</h1>
        <p class="text-body-1">
          Opções de configuração da conta e da aplicação.
        </p>
        <v-alert type="info" variant="tonal" class="mt-6" border="start" density="compact">
          Funcionalidade em desenvolvimento.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['authenticated']
});
useHead({
  title: 'Configurações - OEPlan',
});
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.mt-6 {
  margin-top: 24px;
}
</style>
