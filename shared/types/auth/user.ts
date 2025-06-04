// shared/types/auth/user.ts

// Interface para o utilizador completo, geralmente retornada após login ou ao buscar detalhes do utilizador
export interface User {
  uuid: string;
  username: string; // Pode ser o email ou um nome de utilizador único
  first_name: string;
  last_name: string;
  email: string;
  role: string; // Ex: 'Administrador', 'Professor', 'Coordenador'
  // Adicione quaisquer outros campos que seu backend possa retornar para um utilizador autenticado
  // avatar_url?: string;
  // created_at?: string;
  // updated_at?: string;
}

// Interface para uma representação mais simples do utilizador,
// útil para listas, atribuir tarefas, comentários, etc.
export interface SimpleUser {
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string; // O email pode ser útil para identificação ou contato
  // avatar_url?: string; // Opcional
}
