// plugins/auth.client.ts
import { useAuth } from '~/composables/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Obtém a função initState do seu composable de autenticação
  const { initState } = useAuth();

  // Executa a inicialização do estado de autenticação apenas no lado do cliente.
  // A verificação 'process.client' dentro de initState no composable também
  // garante que operações específicas do cliente (como acesso a cookies)
  // sejam seguras.
  if (process.client) {
    initState();
    console.log('[AuthPluginMock] Estado de autenticação (mock) inicializado no cliente através do plugin.');
  }
});
