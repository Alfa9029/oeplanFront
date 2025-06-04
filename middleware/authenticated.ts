// middleware/authenticated.ts
import { useAuth } from '~/composables/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Esta versão poderia ter problemas se `useAuth()` não retornasse `isAuthenticated`
    // ou se a lógica de inicialização não fosse robusta.
    const { isAuthenticated } = useAuth();

    const publicPages = ['/login', '/magic-link', '/auth/callback'];
    const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/auth/callback');

    if (authRequired && !isAuthenticated.value) {
      return navigateTo('/login');
    }

    if (isAuthenticated.value && (to.path === '/login' || to.path === '/magic-link')) {
        return navigateTo('/');
    }
  }
});
