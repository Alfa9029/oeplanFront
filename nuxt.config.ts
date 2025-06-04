// nuxt.config.ts
import { resolve } from 'pathe'; // Importe 'resolve' de 'pathe'

export default defineNuxtConfig({
  // Data de compatibilidade
  compatibilityDate: "2024-07-05",

  // Ferramentas de desenvolvimento
  devtools: { enabled: true },

  // CSS
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.min.css",
    "~/assets/css/global.css",
  ],

  // Módulos
  modules: [
    [
      "vuetify-nuxt-module",
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

  // Build
  build: {
    transpile: ['vuetify'],
  },

  // Alias para pastas personalizadas
  alias: {
    // Adiciona um alias para a pasta 'shared'
    // Agora você pode importar de '~/shared/...' em qualquer lugar do seu projeto
    '~/shared': resolve(__dirname, './shared'),
    // Você também pode usar '@shared' ou outro nome se preferir:
    // '@shared': resolve(__dirname, './shared'),
  },

  // Configurações de runtime (se necessário)
  // runtimeConfig: {
  //   public: {
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
  //   },
  // },
});
