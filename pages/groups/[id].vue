<template>
  <v-container>
    <h1>Detalhes do Grupo: {{ groupId }}</h1>
    <v-divider class="my-4"></v-divider>

    <h2>Tarefas do Grupo</h2>
    <div v-if="tasksForGroup.length === 0">
      <p>Nenhuma tarefa para este grupo ainda.</p>
    </div>
    <v-list v-else>
      <v-list-item
        v-for="task in tasksForGroup"
        :key="task.uuid"
        :title="task.title"
        :subtitle="`Status: ${task.status} - Visibilidade: ${task.visibility}`"
      >
        <template v-slot:append>
          <v-chip small :color="getPriorityColor(task.priority)">{{ task.priority }}</v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4"></v-divider>

    <h2>Adicionar Nova Tarefa ao Grupo</h2>
    <v-form @submit.prevent="createNewTaskForGroup">
      <v-text-field
        v-model="newTaskForm.title"
        label="Título da Tarefa"
        variant="outlined"
        density="compact"
        class="mb-2"
      ></v-text-field>
      <v-textarea
        v-model="newTaskForm.description"
        label="Descrição"
        variant="outlined"
        density="compact"
        rows="3"
        class="mb-2"
      ></v-textarea>
      <v-select
        v-model="newTaskForm.visibility"
        :items="visibilityOptions"
        label="Visibilidade da Tarefa"
        variant="outlined"
        density="compact"
        class="mb-2"
      ></v-select>
       <v-select
        v-model="newTaskForm.priority"
        :items="priorityOptions"
        label="Prioridade"
        variant="outlined"
        density="compact"
        class="mb-2"
      ></v-select>
      <v-select
        v-model="newTaskForm.status"
        :items="statusOptions"
        label="Status"
        variant="outlined"
        density="compact"
        class="mb-2"
      ></v-select>
      <v-btn type="submit" color="primary">Adicionar Tarefa</v-btn>
    </v-form>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'; // Ou useRoute() do Nuxt
import type { Task, SimpleUser } from '~/shared/types/task.ts'; // Ajuste o caminho conforme sua estrutura de pastas
import { MOCK_GROUP_TASKS, allMockSimpleUsers } from '~/shared/data/mockData'; // Seus dados mockados

// Definição dos tipos literais para as propriedades da Tarefa
type TaskVisibility = 'Pública' | 'Privada' | 'Grupo';
type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';
type TaskPriority = 'Baixa' | 'Média' | 'Alta';

const route = useRoute();
const groupId = ref(route.params.id as string); // ID do grupo da URL

const tasksForGroup = ref<Task[]>([]);

// Opções para os seletores do formulário
const visibilityOptions: TaskVisibility[] = ['Pública', 'Privada', 'Grupo'];
const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorityOptions: TaskPriority[] = ['Baixa', 'Média', 'Alta'];

// Estado reativo para o formulário da nova tarefa
const newTaskForm = reactive({
  title: '',
  description: '',
  visibility: 'Grupo' as TaskVisibility, // Valor inicial válido e tipado
  priority: 'Média' as TaskPriority,
  status: 'To Do' as TaskStatus,
  // Outros campos necessários para uma tarefa podem ser adicionados aqui
  // como due_date, assigned_to, assigned_by, tags, category
});

// Simular carregamento de tarefas existentes para o grupo
onMounted(() => {
  // Em uma aplicação real, você buscaria isso de um store ou API
  if (MOCK_GROUP_TASKS[groupId.value]) {
    tasksForGroup.value = MOCK_GROUP_TASKS[groupId.value];
  }
});

function createNewTaskForGroup() {
  if (!newTaskForm.title || !newTaskForm.description) {
    alert('Título e Descrição são obrigatórios!');
    return;
  }

  // Exemplo de como pegar usuários para assigned_to e assigned_by
  // Em uma aplicação real, isso viria do usuário logado ou de um seletor de usuários
  const currentUser = allMockSimpleUsers[0] || { uuid: 'default-user-uuid', username: 'default.user', first_name: 'Default', last_name: 'User', email: 'default@example.com' };
  const assignedToUserExample = allMockSimpleUsers[1] || currentUser;


  // Criando o objeto da nova tarefa, garantindo que 'visibility' e outras
  // propriedades de tipo literal tenham os valores corretos.
  const newTaskObject: Task = {
    uuid: crypto.randomUUID(), // Gera um UUID único para a nova tarefa
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: newTaskForm.title,
    description: newTaskForm.description,
    due_date: null, // Defina conforme necessário, pode vir do formulário
    assigned_to: assignedToUserExample, // Usuário para quem a tarefa é atribuída
    assigned_by: currentUser, // Usuário que atribuiu a tarefa (ex: usuário logado)
    status: newTaskForm.status, // Do formulário, já tipado
    priority: newTaskForm.priority, // Do formulário, já tipado
    visibility: newTaskForm.visibility, // Do formulário, já tipado corretamente
    tags: ['Nova', groupId.value], // Exemplo de tags
    category: 'Grupo', // Exemplo de categoria
  };

  // Adiciona a nova tarefa à lista local (em uma aplicação real, você enviaria para um store/API)
  tasksForGroup.value.push(newTaskObject);
  console.log('Nova tarefa para o grupo criada:', newTaskObject);

  // Limpa os campos do formulário
  newTaskForm.title = '';
  newTaskForm.description = '';
  newTaskForm.visibility = 'Grupo'; // Reset para o valor padrão
  newTaskForm.priority = 'Média';
  newTaskForm.status = 'To Do';
}

// Função auxiliar para cor do chip de prioridade
function getPriorityColor(priority: TaskPriority): string {
  if (priority === 'Alta') return 'error';
  if (priority === 'Média') return 'warning';
  return 'success'; // Baixa
}

// Se você precisar buscar detalhes de uma tarefa específica que está causando o erro:
// async function fetchTaskDetails(taskId: string) {
//   // Suponha que 'apiGetTaskById' retorne um objeto que pode não estar bem tipado
//   const rawTaskData = await apiGetTaskById(taskId);
//
//   // Aqui você faria a validação ou transformação
//   const validatedTask: Task = {
//     ...rawTaskData,
//     visibility: normalizeTaskVisibility(rawTaskData.visibility), // Função de normalização
//     status: normalizeTaskStatus(rawTaskData.status),
//     priority: normalizeTaskPriority(rawTaskData.priority),
//     // ... e assim por diante para outras propriedades de tipo literal
//   };
//   // Use 'validatedTask' no seu componente
// }

// Funções de normalização (exemplo, se os dados vierem de uma fonte não confiável)
// function normalizeTaskVisibility(value: any): TaskVisibility {
//   const validVisibilities: TaskVisibility[] = ['Pública', 'Privada', 'Grupo'];
//   if (validVisibilities.includes(value as TaskVisibility)) {
//     return value as TaskVisibility;
//   }
//   console.warn(`Valor de visibilidade inválido '${value}', usando 'Privada' como padrão.`);
//   return 'Privada'; // Valor padrão ou lançar erro
// }
// (Funções similares para status e priority seriam necessárias se os dados de origem não forem confiáveis)

</script>

<style scoped>
/* Estilos podem ser adicionados aqui */
</style>
