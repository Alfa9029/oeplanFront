// plugins/auth.client.ts
import { useAuth } from '~/composables/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Esta versão chamava `initializeAuth` que, por sua vez, poderia ser
  // chamada automaticamente também dentro do `useAuth`, causando múltiplas execuções.
  const { initializeAuth } = useAuth();

  if (process.client) { // Redundante, pois .client.ts já garante
    await initializeAuth();
  }
});
