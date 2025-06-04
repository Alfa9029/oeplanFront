// shared/types/task.ts

export interface Task {
  uuid: string;
  created_at: string; // Formato ISO Date String (ex: "2023-10-27T10:00:00.000Z")
  updated_at: string; // Formato ISO Date String
  title: string;
  description: string;
  due_date?: string | null; // Formato YYYY-MM-DD ou ISO Date String
  assigned_to: SimpleUser; // Quem é o responsável pela tarefa
  assigned_by: SimpleUser; // Quem atribuiu a tarefa
  status: TaskStatus; // Status da tarefa
  priority: TaskPriority; // Prioridade da tarefa
  visibility: TaskVisibility; // Visibilidade da tarefa
  tags?: string[]; // Lista de tags associadas à tarefa
  category?: string; // Categoria da tarefa (opcional)
  // Adicione outros campos que possam ser relevantes para uma tarefa
  // group_uuid?: string | null; // Se a tarefa pertencer a um grupo específico
  // attachments?: Attachment[]; // Se houver anexos
}

// Interface para um possível anexo (exemplo)
// export interface Attachment {
//   uuid: string;
//   file_name: string;
//   file_url: string;
//   file_type: string; // ex: 'application/pdf', 'image/png'
//   uploaded_at: string;
// }

export type SimpleUser = {
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type TaskVisibility = 'Pública' | 'Privada' | 'Grupo';
export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
