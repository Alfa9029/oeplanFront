<template>
  <v-container fluid>
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Painel de Tarefas</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateTaskDialog" prepend-icon="mdi-plus-circle-outline">
          Criar Tarefa
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-card flat class="mb-6 pa-4" color="surface-variant" variant="tonal">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchTerm"
            label="Pesquisar por nome..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedStatus"
            :items="statusFilterOptions"
            item-title="text"
            item-value="value"
            label="Filtrar por Status"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedPriority"
            :items="priorityFilterOptions"
            item-title="text"
            item-value="value"
            label="Filtrar por Prioridade"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="selectedDate"
            label="Data de Criação"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <!-- Kanban Board -->
    <v-row>
      <v-col
        v-for="statusColumn in taskColumns"
        :key="statusColumn.id"
        cols="12"
        md="4"
      >
        <v-card class="pa-2 task-column-card" color="background-lighten-1" flat>
          <v-card-title class="text-h6 font-weight-medium mb-2 d-flex align-center">
            {{ statusColumn.title }}
            <v-chip size="small" color="primary" class="ml-2" label>{{ filteredTasksByStatus(statusColumn.status).length }}</v-chip>
          </v-card-title>
          <v-card-text class="pa-1 task-column-content">
            <!-- Área de Arrastar e Soltar (Drag and Drop) - Exemplo com vuedraggable (requer instalação) -->
            <!-- <draggable v-model="tasksByStatus[statusColumn.status]" group="tasks" item-key="uuid" class="space-y-3 min-h-task-column"> -->
            <!--   <template #item="{element}"> -->
            <!--     <TaskCard :task="element" @click="navigateToTask(element.uuid)" @editTask="openEditTaskDialog" @deleteTask="confirmDeleteTask" /> -->
            <!--   </template> -->
            <!-- </draggable> -->
            <div v-if="filteredTasksByStatus(statusColumn.status).length > 0" class="space-y-3">
              <TaskCard
                v-for="task in filteredTasksByStatus(statusColumn.status)"
                :key="task.uuid"
                :task="task"
                @click="navigateToTask(task.uuid)"
                @viewDetails="navigateToTask"
                @editTask="openEditTaskDialog"
                @deleteTask="confirmDeleteTask"
                @moveToTodo="moveTaskToStatus(task.uuid, 'To Do')"
                @moveToInProgress="moveTaskToStatus(task.uuid, 'In Progress')"
                @moveToInReview="moveTaskToStatus(task.uuid, 'In Review')"
                @moveToDone="moveTaskToStatus(task.uuid, 'Done')"
              />
            </div>
            <div v-else class="text-center pa-8 text-disabled">
              <v-icon size="48" class="mb-2">mdi-format-list-checks</v-icon>
              <p>Nenhuma tarefa {{ statusColumn.title.toLowerCase() }}.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para Criar/Editar Tarefa -->
    <v-dialog v-model="taskDialog" max-width="700px" persistent>
      <CreateTaskForm
        :initial-task-data="editingTask"
        :users-list="mockUsersForSelect"
        @close="closeTaskDialog"
        @task-saved="handleTaskSaved"
      />
    </v-dialog>

    <!-- Diálogo de Confirmação de Exclusão -->
    <v-dialog v-model="deleteConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir esta tarefa?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="executeDeleteTask">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task } from '~/shared/types/task';
import type { User, SimpleUser } from '~/shared/types/auth/user'; // Import SimpleUser
import TaskCard from '~/components/TaskCard.vue';
import CreateTaskForm from '~/components/CreateTaskForm.vue'; // Novo componente
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/auth';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Painel de Tarefas - OEPlan',
});

const router = useRouter();
const { state: authState } = useAuth();

const taskDialog = ref(false);
const editingTask = ref<Task | null>(null); // Para popular o formulário ao editar
const deleteConfirmDialog = ref(false);
const taskToDeleteId = ref<string | null>(null);


// Mock Data (Utilizadores) - Usado para o select de "Responsável" e "Criado por"
const mockAdminUser: User = { uuid: 'user-uuid-admin', username: 'admin@gmail.com', first_name: 'Admin', last_name: 'Principal', email: 'admin@gmail.com', role: 'Administrador' };
const mockUser1: User = { uuid: 'user-uuid-1', username: 'john.doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 'Professor' };
const mockUser2: User = { uuid: 'user-uuid-2', username: 'jane.smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', role: 'Coordenador' };

// Lista de utilizadores para o select no formulário de tarefas
const mockUsersForSelect = computed<SimpleUser[]>(() => [
  { uuid: mockAdminUser.uuid, username: mockAdminUser.username, first_name: mockAdminUser.first_name, last_name: mockAdminUser.last_name, email: mockAdminUser.email },
  { uuid: mockUser1.uuid, username: mockUser1.username, first_name: mockUser1.first_name, last_name: mockUser1.last_name, email: mockUser1.email },
  { uuid: mockUser2.uuid, username: mockUser2.username, first_name: mockUser2.first_name, last_name: mockUser2.last_name, email: mockUser2.email },
]);


const allTasks = ref<Task[]>([
  { uuid: 'task-uuid-1', created_at: '2025-03-10T10:00:00Z', updated_at: '2025-03-11T14:30:00Z', title: 'Preparar Aula de Cálculo I', description: 'Revisar material e preparar slides para a próxima aula.', due_date: '2025-03-15', assigned_to: mockUser1, assigned_by: mockAdminUser, status: 'To Do', priority: 'Alta', visibility: 'Privada', tags: ['Cálculo', 'Aula'], category: "Ensino" },
  { uuid: 'task-uuid-2', created_at: '2025-03-12T09:00:00Z', updated_at: '2025-03-13T11:00:00Z', title: 'Corrigir Provas de Algoritmos', description: 'Corrigir provas da turma ENG2023 de Algoritmos e Estruturas de Dados.', due_date: '2025-03-20', assigned_to: mockUser1, assigned_by: mockUser2, status: 'In Progress', priority: 'Média', visibility: 'Privada', tags: ['Avaliação', 'Engenharia', 'Algoritmos'], category: "Avaliação" },
  { uuid: 'task-uuid-3', created_at: '2025-03-14T15:00:00Z', updated_at: '2025-03-14T17:00:00Z', title: 'Reunião Pedagógica Semestral', description: 'Participar da reunião sobre o novo currículo e planeamento do próximo semestre.', due_date: '2025-03-18', assigned_to: mockUser2, assigned_by: mockAdminUser, status: 'To Do', priority: 'Alta', visibility: 'Grupo', tags: ['Reunião', 'Currículo', 'Planeamento'], category: "Administrativo" },
  { uuid: 'task-uuid-4', created_at: '2025-03-15T11:00:00Z', updated_at: '2025-03-16T16:00:00Z', title: 'Lançar Notas no Sistema Acadêmico', description: 'Lançar notas finais da disciplina de Física I no sistema acadêmico oficial.', due_date: '2025-03-22', assigned_to: mockUser1, assigned_by: mockUser2, status: 'In Review', priority: 'Baixa', visibility: 'Privada', tags: ['Notas', 'Acadêmico', 'Física'], category: "Administrativo" },
  { uuid: 'task-uuid-5', created_at: '2025-03-18T11:00:00Z', updated_at: '2025-03-18T16:00:00Z', title: 'Orientação de TCC - Aluno Silva', description: 'Reunião de orientação com o aluno João Silva sobre o progresso do TCC.', due_date: '2025-03-25', assigned_to: mockUser2, assigned_by: mockAdminUser, status: 'Done', priority: 'Média', visibility: 'Privada', tags: ['TCC', 'Orientação'], category: "Acadêmico" },
]);

const taskColumns = [
  { id: 'todo', title: 'A Fazer', status: 'To Do' as Task['status'] },
  { id: 'inprogress', title: 'Em Progresso', status: 'In Progress' as Task['status'] },
  { id: 'inreview', title: 'Em Revisão', status: 'In Review' as Task['status'] },
  { id: 'done', title: 'Concluído', status: 'Done' as Task['status']},
];

// Filtros
const searchTerm = ref('');
const selectedStatus = ref<Task['status'] | null>(null);
const selectedPriority = ref<Task['priority'] | null>(null);
const selectedDate = ref('');

const statusFilterOptions = [
  { text: 'Todos os Status', value: null },
  { text: 'A Fazer', value: 'To Do' },
  { text: 'Em Progresso', value: 'In Progress' },
  { text: 'Em Revisão', value: 'In Review' },
  { text: 'Concluído', value: 'Done' },
];
const priorityFilterOptions = [
  { text: 'Todas as Prioridades', value: null },
  { text: 'Alta', value: 'Alta' },
  { text: 'Média', value: 'Média' },
  { text: 'Baixa', value: 'Baixa' },
];

const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    const matchesSearch = !searchTerm.value || task.title.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || task.status === selectedStatus.value;
    const matchesPriority = !selectedPriority.value || task.priority === selectedPriority.value;
    const matchesDate = !selectedDate.value || task.created_at.startsWith(selectedDate.value);
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });
});

const filteredTasksByStatus = (columnStatus: Task['status']) => {
  // Se um filtro de status geral estiver ativo, ele tem precedência para a contagem da coluna.
  // Mas para a exibição, mostramos apenas as tarefas que correspondem ao status da coluna E aos outros filtros.
  if (selectedStatus.value && selectedStatus.value !== columnStatus) {
    return []; // Não mostra nada nesta coluna se o filtro de status geral não corresponder
  }
  return filteredTasks.value.filter(task => task.status === columnStatus);
};


const navigateToTask = (uuid: string) => {
  router.push(`/tasks/${uuid}`);
};

const openCreateTaskDialog = () => {
  editingTask.value = null; // Garante que é para criar uma nova tarefa
  taskDialog.value = true;
};

const openEditTaskDialog = (taskId: string) => {
  const taskToEdit = allTasks.value.find(t => t.uuid === taskId);
  if (taskToEdit) {
    editingTask.value = { ...taskToEdit }; // Clona a tarefa para edição
    taskDialog.value = true;
  }
};

const closeTaskDialog = () => {
  taskDialog.value = false;
  editingTask.value = null;
};

const handleTaskSaved = (savedTask: Task) => {
  if (editingTask.value) { // Editando
    const index = allTasks.value.findIndex(t => t.uuid === savedTask.uuid);
    if (index !== -1) {
      allTasks.value[index] = savedTask;
    }
  } else { // Criando
    allTasks.value.unshift(savedTask); // Adiciona no início da lista
  }
  closeTaskDialog();
  // Adicionar notificação de sucesso (snackbar Vuetify)
};

const confirmDeleteTask = (taskId: string) => {
  taskToDeleteId.value = taskId;
  deleteConfirmDialog.value = true;
};

const executeDeleteTask = () => {
  if (taskToDeleteId.value) {
    allTasks.value = allTasks.value.filter(t => t.uuid !== taskToDeleteId.value);
    console.log('Tarefa excluída:', taskToDeleteId.value);
  }
  deleteConfirmDialog.value = false;
  taskToDeleteId.value = null;
  // Adicionar notificação de sucesso
};

const moveTaskToStatus = (taskId: string, newStatus: Task['status']) => {
  const taskIndex = allTasks.value.findIndex(t => t.uuid === taskId);
  if (taskIndex !== -1) {
    allTasks.value[taskIndex].status = newStatus;
    allTasks.value[taskIndex].updated_at = new Date().toISOString(); // Atualiza data de modificação
    console.log(`Tarefa ${taskId} movida para ${newStatus}`);
    // Aqui você faria a chamada API para atualizar o status no backend
  }
};

</script>

<style scoped>
.task-column-card {
  /* Adiciona uma altura mínima para as colunas ficarem alinhadas mesmo vazias */
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.task-column-content {
  flex-grow: 1;
  overflow-y: auto; /* Permite scroll dentro da coluna se houver muitas tarefas */
  padding-bottom: 8px; /* Espaço no final da coluna */
}
.space-y-3 > *:not(:last-child) {
  margin-bottom: 12px; /* Espaçamento entre os TaskCards */
}
.min-h-task-column { /* Para vuedraggable, se usado */
  min-height: 350px;
}
</style>
