// shared/types/group.ts
import type { SimpleUser } from './auth/user'; // Para o proprietário e participantes

export interface Group {
  uuid: string;
  created_at: string; // Formato ISO Date String
  updated_at: string; // Formato ISO Date String
  owner_uuid: string; // UUID do utilizador proprietário do grupo
  owner?: SimpleUser; // Opcional: Objeto do proprietário (pode ser populado depois)
  title: string;
  description: string;
  tags?: string[];
  category?: string; // Ex: "Académico", "Administrativo", "Pesquisa"
  visibility: 'Pública' | 'Privada' | 'Restrita'; // Conforme o documento de requisitos
  // A lista de participantes/membros seria provavelmente gerida numa tabela de junção
  // ou obtida através de um endpoint específico. Para o frontend, podemos ter:
  participants_count?: number; // Contagem de participantes
  tasks_count?: number; // Contagem de tarefas associadas
  // Se quisermos carregar os participantes diretamente no objeto do grupo:
  // participants?: SimpleUser[];
}
