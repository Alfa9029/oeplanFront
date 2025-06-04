<template>
  <v-container fluid v-if="group">
    <!-- Cabeçalho do Grupo com Título e Ações -->
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="8">
        <div class="d-flex align-center">
          <v-icon :color="visibilityColor(group.visibility)" size="x-large" class="mr-3">{{ visibilityIcon(group.visibility) }}</v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">{{ group.title }}</h1>
            <div class="text-medium-emphasis text-caption">
              <span>Categoria: {{ group.category || 'Não definida' }}</span>
              <span class="mx-2">|</span>
              <span>Criado em: {{ formatDate(group.created_at) }}</span>
              <span v-if="group.owner" class="mx-2">|</span>
              <span v-if="group.owner">Proprietário: {{ group.owner.first_name }} {{ group.owner.last_name }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" variant="tonal">
              Ações do Grupo
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click="openEditGroupDialog" prepend-icon="mdi-pencil-outline">
              <v-list-item-title>Editar Grupo</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openAddParticipantDialog" prepend-icon="mdi-account-plus-outline">
              <v-list-item-title>Adicionar Participante</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openAddTaskToGroupDialog" prepend-icon="mdi-playlist-plus">
              <v-list-item-title>Adicionar Tarefa ao Grupo</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="confirmDeleteGroup" base-color="error" prepend-icon="mdi-delete-outline">
              <v-list-item-title>Excluir Grupo</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <!-- Coluna de Detalhes do Grupo -->
      <v-col cols="12" md="4">
        <v-card class="mb-4" elevation="2" rounded="lg">
          <v-card-title>Detalhes do Grupo</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p class="text-body-1 mb-3">
              <strong>Descrição:</strong><br>
              {{ group.description || 'Nenhuma descrição fornecida.' }}
            </p>
            <div v-if="group.tags && group.tags.length" class="mb-3">
              <strong>Tags:</strong><br>
              <v-chip v-for="tag in group.tags" :key="tag" size="small" class="mr-1 mt-1" color="secondary" label variant="tonal">
                {{ tag }}
              </v-chip>
            </div>
            <p><strong>Visibilidade:</strong> <v-chip size="small" :color="visibilityColor(group.visibility)" label variant="flat">{{ group.visibility }}</v-chip></p>
          </v-card-text>
        </v-card>

        <v-card elevation="2" rounded="lg">
          <v-card-title>Participantes ({{ participants.length }})</v-card-title>
          <v-divider></v-divider>
          <v-list lines="one" density="compact" v-if="participants.length > 0">
            <v-list-item
              v-for="participant in participants"
              :key="participant.uuid"
              :title="`${participant.first_name} ${participant.last_name}`"
              :subtitle="participant.email"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="32" class="mr-3">
                  <span class="white--text text-caption">{{ participant.first_name[0] }}{{ participant.last_name[0] }}</span>
                </v-avatar>
              </template>
              <!-- Adicionar ação para remover participante se necessário -->
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center text-disabled py-4">
            Nenhum participante adicionado.
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Coluna de Tarefas do Grupo -->
      <v-col cols="12" md="8">
        <h2 class="text-h5 mb-3">Tarefas do Grupo ({{ groupTasks.length }})</h2>
        <div v-if="groupTasks.length > 0" class="space-y-3">
          <TaskCard
            v-for="task in groupTasks"
            :key="task.uuid"
            :task="task"
            @click="navigateToTask(task.uuid)"
            @viewDetails="navigateToTask"
            @editTask="(taskId) => console.log('Editar tarefa do grupo:', taskId)"
            @deleteTask="(taskId) => console.log('Excluir tarefa do grupo:', taskId)"
          />
        </div>
        <v-card v-else flat color="transparent" class="text-center pa-8 text-disabled">
            <v-icon size="64" class="mb-3">mdi-sticker-text-outline</v-icon>
            <p class="text-h6">Nenhuma tarefa neste grupo.</p>
            <v-btn color="primary" variant="tonal" class="mt-4" @click="openAddTaskToGroupDialog">
                Adicionar Tarefa
            </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogos para Ações (placeholders) -->
    <v-dialog v-model="editGroupDialog" max-width="700px" persistent>
      <!-- Usar o CreateGroupForm para edição também -->
      <CreateGroupForm
        :initial-group-data="group"
        :users-list="mockUsersForOwnerSelect"
        @close="editGroupDialog = false"
        @group-saved="handleGroupUpdated"
      />
    </v-dialog>

    <v-dialog v-model="addParticipantDialog" max-width="500px">
      <v-card>
        <v-card-title>Adicionar Participante</v-card-title>
        <v-card-text>Formulário para adicionar participante ao grupo...</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="addParticipantDialog = false">Cancelar</v-btn>
          <v-btn color="primary" text @click="addParticipant">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addTaskToGroupDialog" max-width="700px">
       <v-card>
        <v-card-title>Adicionar Tarefa ao Grupo</v-card-title>
        <v-card-text>
            <p>Selecione uma tarefa existente ou crie uma nova para este grupo.</p>
            <!-- Aqui poderia ter um select de tarefas existentes ou um formulário para nova tarefa -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="addTaskToGroupDialog = false">Cancelar</v-btn>
          <v-btn color="primary" text @click="addTaskToGroup">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <v-dialog v-model="deleteConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir este grupo?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="executeDeleteGroup">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
  <v-container v-else fluid fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
        <p class="text-subtitle-1">A carregar detalhes do grupo...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Group } from '~/shared/types/group';
import type { Task } from '~/shared/types/task';
import type { User, SimpleUser } from '~/shared/types/auth/user';
import TaskCard from '~/components/TaskCard.vue';
import CreateGroupForm from '~/components/CreateGroupForm.vue'; // Reutilizar para edição
import { useAuth } from '~/composables/auth';


definePageMeta({
  layout: 'default',

});

const route = useRoute();
const router = useRouter();
const { state: authState } = useAuth();
const groupId = route.params.id as string;

const group = ref<Group | null>(null);
const participants = ref<SimpleUser[]>([]);
const groupTasks = ref<Task[]>([]);

const editGroupDialog = ref(false);
const addParticipantDialog = ref(false);
const addTaskToGroupDialog = ref(false);
const deleteConfirmDialog = ref(false);

// Mock Data (Utilizadores)
const mockAdminUser: User = { uuid: 'user-uuid-admin', username: 'admin@gmail.com', first_name: 'Admin', last_name: 'Principal', email: 'admin@gmail.com', role: 'Administrador' };
const mockUser1: User = { uuid: 'user-uuid-1', username: 'john.doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 'Professor' };
const mockUser2: User = { uuid: 'user-uuid-2', username: 'jane.smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', role: 'Coordenador' };
const mockUser3: User = { uuid: 'user-uuid-3', username: 'peter.jones', first_name: 'Peter', last_name: 'Jones', email: 'peter@example.com', role: 'Professor' };

const mockUsersForOwnerSelect = computed<SimpleUser[]>(() => [
  { uuid: mockAdminUser.uuid, username: mockAdminUser.username, first_name: mockAdminUser.first_name, last_name: mockAdminUser.last_name, email: mockAdminUser.email },
  { uuid: mockUser1.uuid, username: mockUser1.username, first_name: mockUser1.first_name, last_name: mockUser1.last_name, email: mockUser1.email },
  { uuid: mockUser2.uuid, username: mockUser2.username, first_name: mockUser2.first_name, last_name: mockUser2.last_name, email: mockUser2.email },
]);


const fetchGroupDetails = async () => {
  console.log(`A buscar detalhes para o grupo ID: ${groupId}`);
  // Simulação de fetch API
  const mockGroups: Group[] = [
    { uuid: 'group-uuid-1', created_at: '2025-03-01T08:00:00Z', updated_at: '2025-03-05T10:00:00Z', owner_uuid: mockUser2.uuid, owner: mockUser2, title: 'Grupo de Pesquisa IA', description: 'Grupo focado em Inteligência Artificial e Machine Learning. Exploramos novas fronteiras e publicamos artigos de impacto.', tags: ['IA', 'Pesquisa', 'Inovação'], category: 'Académico', visibility: 'Pública', participants_count: 3, tasks_count: 2 },
    { uuid: 'group-uuid-2', created_at: '2025-02-15T14:00:00Z', updated_at: '2025-03-01T16:30:00Z', owner_uuid: mockUser1.uuid, owner: mockUser1, title: 'Comissão de Eventos Académicos', description: 'Responsável pela organização e execução dos principais eventos acadêmicos do departamento.', tags: ['Eventos', 'Organização'], category: 'Administrativo', visibility: 'Restrita', participants_count: 2, tasks_count: 1  },
  ];
  const foundGroup = mockGroups.find(g => g.uuid === groupId);
  
  if (foundGroup) {
    group.value = foundGroup;
    // Mock de participantes e tarefas para este grupo
    participants.value = [
        { uuid: mockUser1.uuid, username: mockUser1.username, first_name: mockUser1.first_name, last_name: mockUser1.last_name, email: mockUser1.email },
        { uuid: mockUser2.uuid, username: mockUser2.username, first_name: mockUser2.first_name, last_name: mockUser2.last_name, email: mockUser2.email },
        ...(foundGroup.uuid === 'group-uuid-1' ? [{ uuid: mockUser3.uuid, username: mockUser3.username, first_name: mockUser3.first_name, last_name: mockUser3.last_name, email: mockUser3.email }] : [])
    ];
    groupTasks.value = [
        { uuid: `task-group-${groupId}-1`, created_at: '2025-03-10T10:00:00Z', updated_at: '2025-03-11T14:30:00Z', title: `Tarefa Principal do ${foundGroup.title}`, description: 'Descrição da tarefa principal do grupo.', due_date: '2025-04-15', assigned_to: mockUser1, assigned_by: foundGroup.owner || mockAdminUser, status: 'In Progress', priority: 'Alta', visibility: 'Grupo', tags: ['Importante', foundGroup.category || 'Geral'], category: foundGroup.category },
        ...(foundGroup.uuid === 'group-uuid-1' ? [{ uuid: `task-group-${groupId}-2`, created_at: '2025-03-12T09:00:00Z', updated_at: '2025-03-13T11:00:00Z', title: `Tarefa Secundária de IA`, description: 'Detalhes da tarefa secundária.', due_date: '2025-04-20', assigned_to: mockUser3, assigned_by: foundGroup.owner || mockAdminUser, status: 'To Do', priority: 'Média', visibility: 'Grupo', tags: ['Pesquisa'], category: "Académico" }] : [])
    ];
  } else {
    console.warn(`Grupo com ID ${groupId} não encontrado nos mocks.`);
    // Poderia redirecionar para uma página 404 ou de volta para a lista de grupos
    // router.push('/groups');
  }

  useHead({
    title: group.value ? `${group.value.title} - OEPlan` : 'Grupo não encontrado - OEPlan',
  });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/D';
  return new Date(dateString).toLocaleDateString('pt-PT');
};

const visibilityColor = (visibility: Group['visibility'] | undefined): string => {
  switch (visibility?.toLowerCase()) {
    case 'pública': return 'success';
    case 'privada': return 'info';
    case 'restrita': return 'warning';
    default: return 'grey';
  }
};

const visibilityIcon = (visibility: Group['visibility'] | undefined): string => {
  switch (visibility?.toLowerCase()) {
    case 'pública': return 'mdi-earth';
    case 'privada': return 'mdi-lock-outline';
    case 'restrita': return 'mdi-account-group-outline';
    default: return 'mdi-help-circle-outline';
  }
};

const navigateToTask = (uuid: string) => {
  router.push(`/tasks/${uuid}`);
};

const openEditGroupDialog = () => {
  if (group.value) {
    editGroupDialog.value = true;
  }
};
const handleGroupUpdated = (updatedGroup: Group) => {
  if (group.value && updatedGroup.uuid === group.value.uuid) {
    group.value = { ...updatedGroup, owner: mockUsersForOwnerSelect.value.find(u => u.uuid === updatedGroup.owner_uuid) };
    // Atualizar a lista `allGroups` na página `groups/index.vue` se esta página for recarregada
    // ou se houver um estado global para grupos.
  }
  editGroupDialog.value = false;
  // Adicionar notificação de sucesso
};

const openAddParticipantDialog = () => addParticipantDialog.value = true;
const addParticipant = () => {
  console.log("Lógica para adicionar participante ao grupo ID:", group.value?.uuid);
  addParticipantDialog.value = false;
  // Adicionar notificação
};

const openAddTaskToGroupDialog = () => addTaskToGroupDialog.value = true;
const addTaskToGroup = () => {
  console.log("Lógica para adicionar tarefa ao grupo ID:", group.value?.uuid);
  addTaskToGroupDialog.value = false;
  // Adicionar notificação
};

const confirmDeleteGroup = () => {
  deleteConfirmDialog.value = true;
};
const executeDeleteGroup = () => {
  console.log("Lógica para excluir grupo ID:", group.value?.uuid);
  deleteConfirmDialog.value = false;
  // Adicionar notificação e redirecionar
  router.push('/groups');
};


onMounted(() => {
  fetchGroupDetails();
});
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom)); /* Ajustar para altura da app bar e footer */
}
.text-disabled {
   color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}
.font-italic {
  font-style: italic;
}
.space-y-3 > *:not(:last-child) {
  margin-bottom: 12px;
}
.white--text {
  color: white; /* Ou use rgb(var(--v-theme-on-primary)) se primary for a cor do avatar */
}
</style>
