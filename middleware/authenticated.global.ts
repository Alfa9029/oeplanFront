// middleware/authenticated.global.ts
// IMPORTANTE: O nome deste arquivo terminando com '.global.ts'
// faz com que o Nuxt o aplique automaticamente a todas as rotas.

import { useAuth } from '~/composables/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  // Lista de páginas públicas que não exigem autenticação.
  // Adicione outras rotas públicas aqui se necessário (ex: /register, /forgot-password)
  const publicPages = ['/login', '/magic-link'];

  // Verifica se a rota de destino (to.path) é uma rota que requer autenticação.
  const authRequired = !publicPages.includes(to.path);

  // Debug Log (descomente para ajudar a depurar o fluxo)
  // console.log(
  //   `[Auth Middleware] Para: ${to.path}, De: ${from.path || 'direto'}, Autenticado: ${isAuthenticated.value}, Requer Auth: ${authRequired}`
  // );

  // CASO 1: Usuário NÃO autenticado tentando acessar uma página PROTEGIDA
  if (authRequired && !isAuthenticated.value) {
    // console.log(`[Auth Middleware] Acesso negado à rota protegida '${to.path}'. Redirecionando para /login.`);
    // Evita redirecionar para /login se já estiver tentando acessar /login (caso raro, mas seguro)
    if (to.path !== '/login') {
      // Você pode querer salvar a rota que o usuário tentou acessar para redirecioná-lo
      // de volta após o login, especialmente se não for uma navegação via SPA.
      // Ex: if (process.client) { localStorage.setItem('redirectAfterLogin', to.fullPath); }
      return navigateTo('/login');
    }
  }

  // CASO 2: Usuário AUTENTICADO tentando acessar páginas públicas de LOGIN/MAGIC-LINK
  if (isAuthenticated.value && publicPages.includes(to.path)) {
    // console.log(`[Auth Middleware] Usuário autenticado em '${to.path}'. Redirecionando para /dashboard.`);
    return navigateTo('/dashboard'); // Ou sua rota principal após o login (ex: '/')
  }

  // Se nenhuma das condições de redirecionamento for atendida, permite a navegação.
  // console.log(`[Auth Middleware] Permitindo navegação para ${to.path}.`);
});
