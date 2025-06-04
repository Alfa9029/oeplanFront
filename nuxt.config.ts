// nuxt.config.ts
export default defineNuxtConfig({
  // Data de compatibilidade, pode ser a data atual ou uma recente
  compatibilityDate: "2024-07-05",

  // Habilita as ferramentas de desenvolvimento do Nuxt
  devtools: { enabled: true },

  // CSS: Importa os estilos do Vuetify, ícones MDI e seu CSS global
  css: [
    "vuetify/styles", // Estilos base do Vuetify
    "@mdi/font/css/materialdesignicons.min.css", // Ícones Material Design
    "~/assets/css/global.css", // Seu CSS global para overrides e variáveis
  ],

  // Módulos a serem usados pelo Nuxt
  modules: [
    [
      "vuetify-nuxt-module", // Módulo de integração do Vuetify
      {
        vuetifyOptions: {
          theme: {
            defaultTheme: 'light',
            themes: {
              light: {
                dark: false,
                colors: {
                  primary: '#14343f',
                  secondary: '#50a3c3',
                  accent: '#f0a500',
                  surface: '#FFFFFF',
                  background: '#f4f7f6',
                  error: '#B00020',
                  info: '#2196F3',
                  success: '#4CAF50',
                  warning: '#FB8C00',
                },
              },
              dark: {
                dark: true,
                colors: {
                  primary: '#50a3c3',
                  secondary: '#1E293B',
                  accent: '#f0a500',
                  surface: '#1E293B',
                  background: '#0e1321',
                },
              },
            },
          },
          icons: {
            defaultSet: 'mdi',
          },
        },
      }
    ],
  ],

  // Necessário para o Vuetify 3 funcionar corretamente com o Vite (usado pelo Nuxt 3)
  build: {
    transpile: ['vuetify'],
  },


  // Configurações de runtime para variáveis de ambiente (se necessário)
  // runtimeConfig: {
  //   public: {
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
  //   },
  // },
});
