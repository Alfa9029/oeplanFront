// shared/data/mockData.ts
import type { User, SimpleUser } from '~/shared/types/auth/user';
import type { Group } from '~/shared/types/group';
import type { Task } from '~/shared/types/task';

// --- Utilizadores Mock ---
export const mockAdminUser: User = { uuid: 'user-uuid-admin', username: 'admin@gmail.com', first_name: 'Admin', last_name: 'Principal', email: 'admin@gmail.com', role: 'Administrador' };
export const mockUser1: User = { uuid: 'user-uuid-1', username: 'john.doe', first_name: 'João', last_name: 'Silva', email: 'joao.silva@example.com', role: 'Professor' };
export const mockUser2: User = { uuid: 'user-uuid-2', username: 'jane.smith', first_name: 'Maria', last_name: 'Santos', email: 'maria.santos@example.com', role: 'Coordenador' };
export const mockUser3: User = { uuid: 'user-uuid-3', username: 'peter.jones', first_name: 'Pedro', last_name: 'Almeida', email: 'pedro.almeida@example.com', role: 'Professor' };

export const allMockSimpleUsers: SimpleUser[] = [
  { uuid: mockAdminUser.uuid, username: mockAdminUser.username, first_name: mockAdminUser.first_name, last_name: mockAdminUser.last_name, email: mockAdminUser.email },
  { uuid: mockUser1.uuid, username: mockUser1.username, first_name: mockUser1.first_name, last_name: mockUser1.last_name, email: mockUser1.email },
  { uuid: mockUser2.uuid, username: mockUser2.username, first_name: mockUser2.first_name, last_name: mockUser2.last_name, email: mockUser2.email },
  { uuid: mockUser3.uuid, username: mockUser3.username, first_name: mockUser3.first_name, last_name: mockUser3.last_name, email: mockUser3.email },
];

// --- Grupos Mock ---
export const MOCK_GROUPS: Group[] = [
  {
    uuid: 'group-uuid-1',
    created_at: '2025-03-01T08:00:00Z',
    updated_at: '2025-03-05T10:00:00Z',
    owner_uuid: mockUser2.uuid, // Maria Santos
    owner: allMockSimpleUsers.find(u => u.uuid === mockUser2.uuid),
    title: 'Grupo de Pesquisa IA Aplicada',
    description: 'Focado em projetos de Inteligência Artificial e Machine Learning com aplicação prática na indústria e academia. Exploramos novas fronteiras e publicamos artigos de impacto.',
    tags: ['IA', 'Pesquisa', 'Inovação', 'Machine Learning'],
    category: 'Académico Avançado',
    visibility: 'Pública',
    participants_count: 3, // Simulado
    tasks_count: 2, // Simulado
  },
  {
    uuid: 'group-uuid-2',
    created_at: '2025-02-15T14:00:00Z',
    updated_at: '2025-03-01T16:30:00Z',
    owner_uuid: mockUser1.uuid, // João Silva
    owner: allMockSimpleUsers.find(u => u.uuid === mockUser1.uuid),
    title: 'Comissão Organizadora de Eventos',
    description: 'Responsável pelo planeamento, organização e execução dos principais eventos académicos do departamento, incluindo seminários, workshops e a semana académica anual.',
    tags: ['Eventos', 'Organização', 'Seminários'],
    category: 'Administrativo',
    visibility: 'Restrita',
    participants_count: 2, // Simulado
    tasks_count: 1, // Simulado
  },
  {
    uuid: 'group-uuid-3',
    created_at: '2025-03-10T11:00:00Z',
    updated_at: '2025-03-10T11:00:00Z',
    owner_uuid: mockAdminUser.uuid, // Admin Principal
    owner: allMockSimpleUsers.find(u => u.uuid === mockAdminUser.uuid),
    title: 'Projetos de Extensão Comunitária',
    description: 'Desenvolvimento e coordenação de projetos de extensão universitária que visam aplicar o conhecimento académico para beneficiar a comunidade local em diversas áreas.',
    tags: ['Extensão', 'Comunidade', 'Impacto Social'],
    category: 'Extensão Universitária',
    visibility: 'Privada',
    participants_count: 1, // Simulado
    tasks_count: 0, // Simulado
  },
];

// --- Tarefas Mock (associadas aos grupos) ---
export const MOCK_GROUP_TASKS: { [key: string]: Task[] } = {
  'group-uuid-1': [ // Tarefas para o Grupo de Pesquisa IA
    {
      uuid: 'task-g1-001', created_at: '2025-03-10T10:00:00Z', updated_at: '2025-03-11T14:30:00Z',
      title: 'Revisão Bibliográfica de Redes Neurais Convolucionais',
      description: 'Compilar e analisar os artigos mais recentes sobre CNNs para o projeto X.',
      due_date: '2025-04-15',
      assigned_to: allMockSimpleUsers[1], // João Silva
      assigned_by: allMockSimpleUsers[2], // Maria Santos (owner do grupo)
      status: 'In Progress', priority: 'Alta', visibility: 'Grupo',
      tags: ['CNN', 'Revisão', 'Artigo'], category: 'Pesquisa'
    },
    {
      uuid: 'task-g1-002', created_at: '2025-03-12T09:00:00Z', updated_at: '2025-03-13T11:00:00Z',
      title: 'Implementar Protótipo de Classificador de Imagens',
      description: 'Desenvolver um protótipo funcional do classificador usando TensorFlow/Keras.',
      due_date: '2025-05-20',
      assigned_to: allMockSimpleUsers[3], // Pedro Almeida
      assigned_by: allMockSimpleUsers[2],
      status: 'To Do', priority: 'Alta', visibility: 'Grupo',
      tags: ['Implementação', 'TensorFlow', 'Visão Computacional'], category: 'Desenvolvimento'
    }
  ],
  'group-uuid-2': [ // Tarefas para a Comissão de Eventos
    {
      uuid: 'task-g2-001', created_at: '2025-03-05T10:00:00Z', updated_at: '2025-03-06T14:30:00Z',
      title: 'Definir Palestrantes para Semana Académica',
      description: 'Contactar e confirmar os palestrantes convidados para a Semana Académica.',
      due_date: '2025-04-01',
      assigned_to: allMockSimpleUsers[1], // João Silva (owner do grupo)
      assigned_by: allMockSimpleUsers[1],
      status: 'In Review', priority: 'Média', visibility: 'Grupo',
      tags: ['Palestrantes', 'Semana Académica'], category: 'Organização'
    }
  ],
  'group-uuid-3': [] // Grupo de Extensão sem tarefas iniciais
};

// --- Participantes Mock (associados aos grupos) ---
export const MOCK_GROUP_PARTICIPANTS: { [key: string]: SimpleUser[] } = {
  'group-uuid-1': [allMockSimpleUsers[1], allMockSimpleUsers[2], allMockSimpleUsers[3]], // João, Maria, Pedro
  'group-uuid-2': [allMockSimpleUsers[0], allMockSimpleUsers[1]], // Admin, João
  'group-uuid-3': [allMockSimpleUsers[0]], // Apenas Admin
};

// Lista geral de tarefas (para o dashboard principal, não associadas a grupos específicos aqui)
export const MOCK_ALL_TASKS: Task[] = [
    { uuid: 'task-uuid-1', created_at: '2025-03-10T10:00:00Z', updated_at: '2025-03-11T14:30:00Z', title: 'Preparar Aula de Cálculo I', description: 'Revisar material e preparar slides para a próxima aula.', due_date: '2025-03-15', assigned_to: allMockSimpleUsers[1], assigned_by: allMockSimpleUsers[0], status: 'To Do', priority: 'Alta', visibility: 'Privada', tags: ['Cálculo', 'Aula'], category: "Ensino" },
    { uuid: 'task-uuid-2', created_at: '2025-03-12T09:00:00Z', updated_at: '2025-03-13T11:00:00Z', title: 'Corrigir Provas de Algoritmos', description: 'Corrigir provas da turma ENG2023 de Algoritmos e Estruturas de Dados.', due_date: '2025-03-20', assigned_to: allMockSimpleUsers[1], assigned_by: allMockSimpleUsers[2], status: 'In Progress', priority: 'Média', visibility: 'Privada', tags: ['Avaliação', 'Engenharia', 'Algoritmos'], category: "Avaliação" },
    // ...pode adicionar mais tarefas gerais aqui
];
