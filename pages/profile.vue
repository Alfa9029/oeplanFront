<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Meu Perfil</h1>
        <p class="text-body-1">
          Informações do perfil do utilizador e opções de edição.
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

});
useHead({
  title: 'Meu Perfil - OEPlan',
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
