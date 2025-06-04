<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
// Você pode adicionar lógica global aqui se necessário,
// como inicialização de temas ou chamadas API globais.
// Exemplo de como definir o tema programaticamente (se não usar o defaultTheme no nuxt.config):
// import { useTheme } from 'vuetify'
// const theme = useTheme()
// onMounted(() => {
//   theme.global.name.value = 'light' // ou 'dark'
// })
</script>

<style>
/* Estilos globais que se aplicam a toda a v-app, se necessário.
   Muitas vezes, global.css é suficiente. */
html, body {
  overscroll-behavior: none; /* Previne "pull-to-refresh" em mobile e outros comportamentos de scroll excessivo */
}
</style>
