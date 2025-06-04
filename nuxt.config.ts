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
        /* Opções do vuetify-nuxt-module */
        // treeshaking: true, // Ativado por padrão, remove componentes não utilizados
        // useIconCDN: false, // Recomendado false se você instalou @mdi/font

        /* Se quiser importar apenas componentes específicos do Vuetify:
        components: ['VApp', 'VAppBar', 'VNavigationDrawer', 'VBtn', 'VCard', 'VTextField', 'VForm', 'VIcon', 'VList', 'VListItem', 'VMain', 'VContainer', 'VRow', 'VCol', 'VSpacer', 'VMenu', 'VAvatar', 'VDivider', 'VDialog', 'VCardTitle', 'VCardText', 'VCardActions', 'VSelect', 'VTextarea', 'VCheckbox', 'VChip'],
        */
        vuetifyOptions: {
          /* Opções globais do Vuetify (passadas para createVuetify) */
          theme: {
            defaultTheme: 'light', // Pode ser 'light' ou 'dark'
            themes: {
              light: {
                dark: false,
                colors: {
                  primary: '#14343f',     // Seu azul escuro principal
                  secondary: '#50a3c3',   // Seu azul claro/ciano
                  accent: '#f0a500',      // Cor de destaque (opcional)
                  surface: '#FFFFFF',
                  background: '#f4f7f6', // Cor de fundo que você definiu
                  error: '#B00020',
                  info: '#2196F3',
                  success: '#4CAF50',
                  warning: '#FB8C00',
                },
              },
              dark: { // Tema escuro opcional
                dark: true,
                colors: {
                  primary: '#50a3c3',    // Ciano como primário no escuro
                  secondary: '#1E293B',  // Um azul mais escuro para secundário
                  accent: '#f0a500',
                  surface: '#1E293B',    // Cor para superfícies como cards
                  background: '#0e1321', // Seu fundo escuro
                  // As cores de estado (error, info, etc.) podem ser as mesmas ou ajustadas
                },
              },
            },
          },
          // Define o conjunto de ícones padrão como MDI (Material Design Icons)
          icons: {
            defaultSet: 'mdi',
          },
        },
      }
    ],
    // Você pode adicionar "@nuxt/icon" aqui se precisar de outras coleções de ícones
    // além do MDI, mas para começar, o MDI é suficiente com Vuetify.
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

  // Se você for usar o módulo @nuxt/icon para ícones SVG customizados
  // icon: {
  //   customCollections: [
  //     {
  //       prefix: 'oeplan',
  //       dir: './assets/icons', // Ajuste o caminho se necessário
  //     },
  //   ],
  // },
});
