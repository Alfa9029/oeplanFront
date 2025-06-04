// shared/types/auth/user-register.ts

// Interface para os dados enviados durante o processo de registo de um novo utilizador
export interface UserRegister {
  first_name: string;
  last_name: string;
  username: string; // Pode ser o email ou um nome de utilizador único
  email: string;
  password: string;
  // confirm_password?: string; // Se a confirmação de senha for tratada no frontend antes do envio
  // role?: string; // O papel pode ser definido por defeito no backend ou selecionado pelo utilizador
}
