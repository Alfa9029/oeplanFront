// middleware/authenticated.ts
import { useAuth } from '~/composables/auth';
import { navigateTo, useCookie } from '#app'; // Importações explícitas do Nuxt

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { state, initState } = useAuth();

  // No cliente, se o estado não estiver logado mas um cookie de sessão mockado existir,
  // tenta inicializar o estado. Isto é crucial para a primeira navegação ou refresh.
  if (process.client && !state.value.isLoggedIn && useCookie('mock-auth-session').value) {
    initState(); // Tenta carregar o estado do cookie simulado
    // Para garantir que o estado reativo seja atualizado antes da próxima verificação,
    // especialmente em navegações rápidas ou no primeiro carregamento.
    // Opcionalmente, pode-se adicionar um pequeno delay ou usar nextTick aqui se houver problemas de timing.
    // Exemplo: await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  // Define as rotas públicas que não requerem autenticação.
  // A rota raiz '/' é incluída para permitir o acesso inicial antes do redirecionamento.
  const publicPages = ['/', '/login', '/magic-login', '/register'];
  const authRequired = !publicPages.includes(to.path);

  // Se a rota requer autenticação e o utilizador não está logado (de acordo com o estado simulado)
  if (authRequired && !state.value.isLoggedIn) {
    console.log(`[AuthMiddlewareMock] Acesso não autorizado a ${to.path}, a redirecionar para /login`);
    // Opcional: guardar a rota que o utilizador tentou aceder para redirecionar após o login
    // const redirectPath = useCookie('redirectAfterLogin');
    // redirectPath.value = to.fullPath;
    return navigateTo('/login'); // Redireciona para a página de login
  }

  // Se o utilizador já está logado e tenta aceder a uma página pública (como login/registo),
  // redireciona para o dashboard. Evita redirecionar da página raiz se ela for pública.
  if (state.value.isLoggedIn && publicPages.includes(to.path) && to.path !== '/') {
    console.log(`[AuthMiddlewareMock] Utilizador logado a tentar aceder a ${to.path}, a redirecionar para /dashboard`);
    return navigateTo('/dashboard');
  }

  // Se nenhuma das condições acima for atendida, permite a navegação
  console.log(`[AuthMiddlewareMock] Acesso permitido a ${to.path}`);
});
