<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h5">Tarefas Arquivadas</h1>
        <p>
          Aqui serão listadas as tarefas arquivadas.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});
useHead({
  title: 'Arquivadas - OEPlan',
});
</script>

<style scoped>
/* Estilos se necessário */
</style>
