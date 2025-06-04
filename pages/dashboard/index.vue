<template>
  <v-container fluid class="pa-md-6 pa-4">
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap ga-2">
      <h1 class="text-h4 text-md-h3 font-weight-bold">Painel de Tarefas</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus-circle-outline"
        size="large"
        class="mt-2 mt-md-0"
        @click="openCreateTaskModal"
        data-testid="create-task-btn"
      >
        Criar Tarefa
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6 pa-4" flat border>
      <v-row align="center" dense>
        <v-col cols="12" md="4" sm="6">
          <v-text-field
            v-model="searchQuery"
            label="Pesquisar por nome..."
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            hide-details
            clearable
            data-testid="search-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-select
            v-model="statusFilter"
            label="Filtrar por Status"
            :items="['Todos os Status', 'To Do', 'In Progress', 'In Review', 'Done']"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            data-testid="status-filter"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-select
            v-model="priorityFilter"
            label="Filtrar por Prioridade"
            :items="['Todas as Prioridades', 'Baixa', 'Média', 'Alta']"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            data-testid="priority-filter"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2" sm="6">
           <v-text-field
              v-model="dateFilter"
              label="Data de Criação"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              data-testid="date-filter"
            ></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <!-- Colunas de Tarefas -->
    <v-row>
      <!-- Coluna A Fazer -->
      <v-col cols="12" md="6" lg="3">
        <div class="d-flex align-center mb-3">
          <h2 class="text-h6 mr-2">A Fazer</h2>
          <v-chip color="blue-grey-lighten-1" text-color="white" size="small" label data-testid="todo-count">{{ tasksToDo.length }}</v-chip>
        </div>
        <div class="task-column" data-testid="todo-column">
          <v-card
            v-for="task in tasksToDo"
            :key="task.uuid"
            class="mb-3 pa-3 task-card"
            elevation="1"
            border
            hover
            @click="openTaskDetails(task)"
            :data-testid="`task-card-${task.uuid}`"
          >
            <div class="d-flex justify-space-between align-start">
              <v-card-title class="pa-0 text-subtitle-1 font-weight-medium mb-1">{{ task.title }}</v-card-title>
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props" @click.stop></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click.stop="openEditTaskModal(task)" title="Editar" prepend-icon="mdi-pencil-outline" :data-testid="`edit-task-${task.uuid}`"></v-list-item>
                  <v-list-item @click.stop="confirmDeleteTask(task.uuid)" title="Excluir" prepend-icon="mdi-delete-outline" base-color="error" :data-testid="`delete-task-${task.uuid}`"></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-card-text class="pa-0 text-body-2 text-medium-emphasis mt-1 task-description">
               {{ task.description }}
            </v-card-text>
            <div class="d-flex align-center mt-3 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar-clock-outline</v-icon> Prazo: {{ formatDate(task.due_date) }}
            </div>
             <div class="d-flex align-center mt-1 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-account-outline</v-icon> Para: {{ task.assigned_to.first_name }}
            </div>
            <div class="mt-3">
              <v-chip v-for="tag in task.tags?.slice(0, 3)" :key="tag" size="x-small" label class="mr-1 mb-1">{{ tag }}</v-chip>
              <v-chip v-if="task.tags && task.tags.length > 3" size="x-small" label class="mr-1 mb-1"> +{{ task.tags.length - 3 }}</v-chip>
            </div>
          </v-card>
          <p v-if="tasksToDo.length === 0" class="text-medium-emphasis text-center pa-4">Nenhuma tarefa aqui.</p>
        </div>
      </v-col>

      <!-- Coluna Em Progresso -->
      <v-col cols="12" md="6" lg="3">
         <div class="d-flex align-center mb-3">
          <h2 class="text-h6 mr-2">Em Progresso</h2>
          <v-chip color="blue-darken-1" text-color="white" size="small" label data-testid="inprogress-count">{{ tasksInProgress.length }}</v-chip>
        </div>
        <div class="task-column" data-testid="inprogress-column">
          <v-card
            v-for="task in tasksInProgress"
            :key="task.uuid"
            class="mb-3 pa-3 task-card"
            elevation="1"
            border
            hover
            @click="openTaskDetails(task)"
            :data-testid="`task-card-${task.uuid}`"
          >
             <div class="d-flex justify-space-between align-start">
              <v-card-title class="pa-0 text-subtitle-1 font-weight-medium mb-1">{{ task.title }}</v-card-title>
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props" @click.stop></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click.stop="openEditTaskModal(task)" title="Editar" prepend-icon="mdi-pencil-outline"></v-list-item>
                  <v-list-item @click.stop="confirmDeleteTask(task.uuid)" title="Excluir" prepend-icon="mdi-delete-outline" base-color="error"></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-card-text class="pa-0 text-body-2 text-medium-emphasis mt-1 task-description">
               {{ task.description }}
            </v-card-text>
             <div class="d-flex align-center mt-3 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar-clock-outline</v-icon> Prazo: {{ formatDate(task.due_date) }}
            </div>
             <div class="d-flex align-center mt-1 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-account-outline</v-icon> Para: {{ task.assigned_to.first_name }}
            </div>
             <div class="mt-3">
              <v-chip v-for="tag in task.tags?.slice(0, 3)" :key="tag" size="x-small" label class="mr-1 mb-1">{{ tag }}</v-chip>
              <v-chip v-if="task.tags && task.tags.length > 3" size="x-small" label class="mr-1 mb-1"> +{{ task.tags.length - 3 }}</v-chip>
            </div>
          </v-card>
          <p v-if="tasksInProgress.length === 0" class="text-medium-emphasis text-center pa-4">Nenhuma tarefa aqui.</p>
        </div>
      </v-col>

      <!-- Coluna Em Revisão -->
      <v-col cols="12" md="6" lg="3">
        <div class="d-flex align-center mb-3">
          <h2 class="text-h6 mr-2">Em Revisão</h2>
          <v-chip color="orange-darken-2" text-color="white" size="small" label data-testid="inreview-count">{{ tasksInReview.length }}</v-chip>
        </div>
        <div class="task-column" data-testid="inreview-column">
          <v-card
            v-for="task in tasksInReview"
            :key="task.uuid"
            class="mb-3 pa-3 task-card"
            elevation="1"
            border
            hover
            @click="openTaskDetails(task)"
            :data-testid="`task-card-${task.uuid}`"
          >
            <div class="d-flex justify-space-between align-start">
              <v-card-title class="pa-0 text-subtitle-1 font-weight-medium mb-1">{{ task.title }}</v-card-title>
               <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props" @click.stop></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click.stop="openEditTaskModal(task)" title="Editar" prepend-icon="mdi-pencil-outline"></v-list-item>
                  <v-list-item @click.stop="confirmDeleteTask(task.uuid)" title="Excluir" prepend-icon="mdi-delete-outline" base-color="error"></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-card-text class="pa-0 text-body-2 text-medium-emphasis mt-1 task-description">
               {{ task.description }}
            </v-card-text>
             <div class="d-flex align-center mt-3 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar-clock-outline</v-icon> Prazo: {{ formatDate(task.due_date) }}
            </div>
             <div class="d-flex align-center mt-1 text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-account-outline</v-icon> Para: {{ task.assigned_to.first_name }}
            </div>
            <div class="mt-3">
              <v-chip v-for="tag in task.tags?.slice(0, 3)" :key="tag" size="x-small" label class="mr-1 mb-1">{{ tag }}</v-chip>
              <v-chip v-if="task.tags && task.tags.length > 3" size="x-small" label class="mr-1 mb-1"> +{{ task.tags.length - 3 }}</v-chip>
            </div>
          </v-card>
          <p v-if="tasksInReview.length === 0" class="text-medium-emphasis text-center pa-4">Nenhuma tarefa aqui.</p>
        </div>
      </v-col>

      <!-- Coluna Concluído -->
      <v-col cols="12" md="6" lg="3">
        <div class="d-flex align-center mb-3">
          <h2 class="text-h6 mr-2">Concluído</h2>
          <v-chip color="green-darken-1" text-color="white" size="small" label data-testid="done-count">{{ tasksDone.length }}</v-chip>
        </div>
        <div class="task-column" data-testid="done-column">
          <v-card
            v-for="task in tasksDone"
            :key="task.uuid"
            class="mb-3 pa-3 task-card"
            elevation="1"
            border
            hover
            @click="openTaskDetails(task)"
            style="opacity: 0.8;"
            :data-testid="`task-card-${task.uuid}`"
          >
            <div class="d-flex justify-space-between align-start">
              <v-card-title class="pa-0 text-subtitle-1 font-weight-medium mb-1" style="text-decoration: line-through;">{{ task.title }}</v-card-title>
               <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props" @click.stop></v-btn>
                </template>
                <v-list density="compact">
                   <v-list-item @click.stop="() => {}" title="Arquivar" prepend-icon="mdi-archive-arrow-down-outline"></v-list-item>
                   <v-list-item @click.stop="confirmDeleteTask(task.uuid)" title="Excluir" prepend-icon="mdi-delete-outline" base-color="error"></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-card-text class="pa-0 text-body-2 text-medium-emphasis mt-1 task-description">
               {{ task.description }}
            </v-card-text>
          </v-card>
          <p v-if="tasksDone.length === 0" class="text-medium-emphasis text-center pa-4">Nenhuma tarefa aqui.</p>
        </div>
      </v-col>
    </v-row>

    <!-- Modal de Detalhes da Tarefa -->
    <TaskDetailsModal
      :task="selectedTaskForDetails"
      :show="isTaskDetailsModalVisible"
      @update:show="isTaskDetailsModalVisible = $event"
      data-testid="task-details-modal"
    />

    <!-- Modal de Formulário de Tarefa (Criar/Editar) -->
    <TaskFormModal
      :show="isTaskFormModalVisible"
      :task-to-edit="taskToEdit"
      @update:show="isTaskFormModalVisible = $event"
      @save="handleSaveTask"
      data-testid="task-form-modal"
    />

    <!-- Snackbar para feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top right">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn icon="mdi-close" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Task, SimpleUser } from '~/shared/types/task'; // Ajuste o caminho se necessário
import { MOCK_ALL_TASKS, allMockSimpleUsers } from '~/shared/data/mockData'; // Usando as tarefas gerais mockadas
import TaskDetailsModal from '~/components/TaskDetailsModal.vue';
// import TaskFormModal from '~/components/TaskFormModal.vue'; // Importa o modal de formulário
import TaskFormModal from './../../components/TaskFormModal.vue';
import { useAuth } from '~/composables/auth';


useHead({
  title: 'Painel de Tarefas - OEPlan',
});

const { loggedInUser } = useAuth();

const TASKS_STORAGE_KEY = 'oeplan_tasks_v1'; // Chave para o localStorage
const allTasks = ref<Task[]>([]);

// Estado para o Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

const showSnackbar = (text: string, color: string = 'success', timeout: number = 3000) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.timeout = timeout;
  snackbar.value.show = true;
};


// Filtros
const searchQuery = ref('');
const statusFilter = ref<string | null>('Todos os Status');
const priorityFilter = ref<string | null>('Todas as Prioridades');
const dateFilter = ref<string | null>(null);


// Carregar tarefas do localStorage ou usar mock
onMounted(() => {
  if (process.client) { // Garante que o localStorage só é acessado no cliente
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks) as Task[];
        // Simples validação para garantir que os dados são um array
        if (Array.isArray(parsedTasks)) {
          allTasks.value = parsedTasks;
        } else {
          throw new Error("Dados do localStorage não são um array.");
        }
      } catch (e) {
        console.error("Erro ao carregar tarefas do localStorage:", e);
        allTasks.value = [...MOCK_ALL_TASKS]; // Usa uma cópia dos mocks para evitar mutação direta
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(allTasks.value));
      }
    } else {
      allTasks.value = [...MOCK_ALL_TASKS];
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(allTasks.value));
    }
  } else {
    // No SSR, podemos inicializar com mocks, mas não haverá persistência
    allTasks.value = [...MOCK_ALL_TASKS];
  }
});

// Salvar tarefas no localStorage sempre que 'allTasks' mudar
watch(allTasks, (newTasks) => {
  if (process.client) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
  }
}, { deep: true });


// Tarefas filtradas
const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    const searchMatch = !searchQuery.value || task.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const statusMatch = statusFilter.value === 'Todos os Status' || !statusFilter.value || task.status === statusFilter.value;
    const priorityMatch = priorityFilter.value === 'Todas as Prioridades' || !priorityFilter.value || task.priority === priorityFilter.value;
    // Ajuste para filtro de data: compara apenas a parte da data (YYYY-MM-DD)
    const dateMatch = !dateFilter.value || (task.created_at && task.created_at.startsWith(dateFilter.value));
    return searchMatch && statusMatch && priorityMatch && dateMatch;
  });
});


// Propriedades computadas para colunas de status baseadas nas tarefas filtradas
const tasksToDo = computed(() => filteredTasks.value.filter(task => task.status === 'To Do'));
const tasksInProgress = computed(() => filteredTasks.value.filter(task => task.status === 'In Progress'));
const tasksInReview = computed(() => filteredTasks.value.filter(task => task.status === 'In Review'));
const tasksDone = computed(() => filteredTasks.value.filter(task => task.status === 'Done'));

// Modal de Detalhes da Tarefa
const selectedTaskForDetails = ref<Task | null>(null);
const isTaskDetailsModalVisible = ref(false);

const openTaskDetails = (task: Task) => {
  selectedTaskForDetails.value = task;
  isTaskDetailsModalVisible.value = true;
};

// Modal de Formulário de Tarefa (Criar/Editar)
const isTaskFormModalVisible = ref(false);
const taskToEdit = ref<Task | null>(null);

const openCreateTaskModal = () => {
  taskToEdit.value = null; // Garante que está em modo de criação
  isTaskFormModalVisible.value = true;
};

const openEditTaskModal = (task: Task) => {
  taskToEdit.value = { ...task }; // Passa uma cópia para evitar mutação direta dos dados reativos
  isTaskFormModalVisible.value = true;
};

const handleSaveTask = (taskDataFromModal: Omit<Task, 'uuid' | 'created_at' | 'updated_at' | 'assigned_by'> & { uuid?: string, assigned_by?: SimpleUser }) => {
  const currentUser = loggedInUser.value || allMockSimpleUsers[0]; // Fallback para usuário mockado se não logado

  if (!currentUser) {
    showSnackbar("Não foi possível identificar o usuário criador da tarefa.", "error");
    return;
  }
  // Garante que assigned_by é SimpleUser
  const assignedBySimpleUser: SimpleUser = {
    uuid: currentUser.uuid,
    username: currentUser.username,
    first_name: currentUser.first_name,
    last_name: currentUser.last_name,
    email: currentUser.email,
  };


  if (taskDataFromModal.uuid) { // Modo Edição
    const index = allTasks.value.findIndex(t => t.uuid === taskDataFromModal.uuid);
    if (index !== -1) {
      // Preserva created_at e assigned_by da tarefa original, atualiza o resto
      const originalTask = allTasks.value[index];
      allTasks.value[index] = {
        ...originalTask, // Mantém uuid, created_at, assigned_by originais
        ...taskDataFromModal, // Aplica todas as outras mudanças do formulário
        assigned_to: taskDataFromModal.assigned_to as Task['assigned_to'], // Garante o tipo correto
        updated_at: new Date().toISOString(),
      };
      showSnackbar('Tarefa atualizada com sucesso!', 'success');
    } else {
      showSnackbar('Erro ao encontrar a tarefa para editar.', 'error');
    }
  } else { // Modo Criação
    const newTask: Task = {
      ...taskDataFromModal,
      uuid: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_by: assignedBySimpleUser, // Usuário que criou a tarefa
      assigned_to: taskDataFromModal.assigned_to as Task['assigned_to'], // Garante o tipo correto
    };
    allTasks.value.unshift(newTask); // Adiciona no início da lista para visibilidade imediata
    showSnackbar('Tarefa criada com sucesso!', 'success');
  }
  isTaskFormModalVisible.value = false;
  taskToEdit.value = null;
};

const confirmDeleteTask = (taskId: string) => {
  // Em um app real, você usaria um componente de diálogo de confirmação mais elegante.
  if (window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
    deleteTask(taskId);
  }
};

const deleteTask = (taskId: string) => {
  const initialLength = allTasks.value.length;
  allTasks.value = allTasks.value.filter(t => t.uuid !== taskId);
  if (allTasks.value.length < initialLength) {
    showSnackbar('Tarefa excluída com sucesso!', 'info');
  } else {
    showSnackbar('Não foi possível excluir a tarefa.', 'error');
  }
};


// Função para formatar datas
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
   try {
    const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  } catch (e) {
    // console.error("Erro ao formatar data:", dateString, e); // Pode ser muito verboso
    return 'Inválida';
  }
};
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.task-card:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important; /* Sombra mais pronunciada no hover */
  transform: translateY(-2px); /* Leve elevação no hover */
}
.task-description {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita a descrição a 3 linhas */
  line-clamp: 3; /* Compatibilidade com a propriedade padrão */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.4em * 3); /* Aproximadamente 3 linhas de texto (ajuste line-height se mudar) */
  line-height: 1.4em; /* Ajuste conforme o tamanho da fonte */
  font-size: 0.875rem; /* Tamanho de fonte para descrição */
  color: rgba(var(--v-theme-on-surface), 0.6); /* Cor mais suave para descrição */
}
.task-column {
  background-color: rgba(var(--v-theme-on-surface), 0.03); /* Um pouco mais sutil */
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px; /* Mais arredondado */
  padding: 16px;
  min-height: 300px; /* Para dar um visual melhor quando vazio */
  /* Ajuste a altura para permitir scroll interno se necessário, ou deixe o layout da página controlar */
  /* height: calc(100vh - 280px); */ /* Exemplo de altura para scroll interno */
  /* overflow-y: auto; */ /* Habilitar scroll se a altura for fixa */
}

/* Melhorias visuais para os filtros */
.v-card.mb-6 {
  border-radius: 12px;
}
</style>
