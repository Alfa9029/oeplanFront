<template>
  <v-container fluid>
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Meus Grupos</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateGroupDialog" prepend-icon="mdi-plus-circle-outline">
          Criar Novo Grupo
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros e Pesquisa para Grupos -->
    <v-card flat class="mb-6 pa-4" color="surface-variant" variant="tonal">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchTerm"
            label="Pesquisar grupos por nome ou descrição..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedCategory"
            :items="categoryOptions"
            label="Filtrar por Categoria"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            no-data-text="Nenhuma categoria encontrada"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedVisibility"
            :items="visibilityFilterOptions"
            item-title="text"
            item-value="value"
            label="Filtrar por Visibilidade"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Lista de Grupos -->
    <v-row v-if="filteredGroups.length > 0">
      <v-col
        v-for="group in filteredGroups"
        :key="group.uuid"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <GroupCard
          :group="group"
          @click="navigateToGroup(group.uuid)"
          @editGroup="openEditGroupDialog(group.uuid)"
          @deleteGroup="confirmDeleteGroup(group.uuid)"
          @viewGroup="navigateToGroup(group.uuid)"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="text-center pa-8 text-disabled">
        <v-icon size="64" class="mb-3">mdi-account-group-outline</v-icon>
        <p class="text-h6">Nenhum grupo encontrado.</p>
        <p v-if="!allGroups.length && !searchTerm" class="text-body-1 mt-2">Crie um novo grupo para começar a organizar as suas atividades em equipa.</p>
      </v-col>
    </v-row>

    <!-- Diálogo para Criar/Editar Grupo -->
    <v-dialog v-model="groupDialog" max-width="700px" persistent scrollable>
      <!-- Passa a lista de utilizadores para o formulário -->
      <CreateGroupForm
        :initial-group-data="editingGroup"
        :users-list="allMockSimpleUsers"
        @close="closeGroupDialog"
        @group-saved="handleGroupSaved"
      />
    </v-dialog>

     <!-- Diálogo de Confirmação de Exclusão -->
    <v-dialog v-model="deleteConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir o grupo "{{ groupToDelete?.title }}"?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="executeDeleteGroup">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Group } from '~/shared/types/group';
import type { SimpleUser } from '~/shared/types/auth/user';
import GroupCard from '~/components/GroupCard.vue';
import CreateGroupForm from '~/components/CreateGroupForm.vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/auth';
import { MOCK_GROUPS, allMockSimpleUsers } from '~/shared/data/mockData'; // Importa os dados mockados

definePageMeta({
  middleware: ['authenticated'],
  layout: 'default',
});

useHead({
  title: 'Meus Grupos - OEPlan',
});

const router = useRouter();
const { state: authState } = useAuth();

const groupDialog = ref(false);
const editingGroup = ref<Group | null>(null);
const deleteConfirmDialog = ref(false);
const groupToDelete = ref<Group | null>(null);


const allGroups = ref<Group[]>([]);

onMounted(() => {
  // Carrega os grupos mockados quando o componente é montado
  // É importante clonar os dados mockados para evitar mutações diretas no array original importado
  allGroups.value = MOCK_GROUPS.map(g => ({
      ...g,
      owner: allMockSimpleUsers.find(u => u.uuid === g.owner_uuid) || undefined
  }));
});


// Filtros
const searchTerm = ref('');
const selectedCategory = ref<string | null>(null);
const selectedVisibility = ref<Group['visibility'] | null>(null);

const categoryOptions = computed(() => {
  const categories = new Set(allGroups.value.map(g => g.category).filter(Boolean) as string[]);
  return [{ title: 'Todas as Categorias', value: null }, ...Array.from(categories).map(c => ({ title: c, value: c }))];
});
const visibilityFilterOptions = [
  { text: 'Todas as Visibilidades', value: null },
  { text: 'Pública', value: 'Pública' as Group['visibility'] },
  { text: 'Privada', value: 'Privada' as Group['visibility'] },
  { text: 'Restrita', value: 'Restrita' as Group['visibility'] },
];

const filteredGroups = computed(() => {
  return allGroups.value.filter(group => {
    const matchesSearch = !searchTerm.value ||
      group.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchTerm.value.toLowerCase()));
    const matchesCategory = !selectedCategory.value || group.category === selectedCategory.value;
    const matchesVisibility = !selectedVisibility.value || group.visibility === selectedVisibility.value;
    return matchesSearch && matchesCategory && matchesVisibility;
  });
});


const navigateToGroup = (uuid: string) => {
  router.push(`/groups/${uuid}`);
};

const openCreateGroupDialog = () => {
  editingGroup.value = null; // Garante que é para criar
  groupDialog.value = true;
};

const openEditGroupDialog = (groupId: string) => {
  const groupToEdit = allGroups.value.find(g => g.uuid === groupId);
  if (groupToEdit) {
    editingGroup.value = { ...groupToEdit }; // Clona para evitar mutação direta
    groupDialog.value = true;
  }
};

const closeGroupDialog = () => {
  groupDialog.value = false;
  editingGroup.value = null;
};

const handleGroupSaved = (savedGroup: Group) => {
  const currentUser = authState.value.user as SimpleUser | undefined;
  if (editingGroup.value && editingGroup.value.uuid === savedGroup.uuid) { // Editando
    const index = allGroups.value.findIndex(g => g.uuid === savedGroup.uuid);
    if (index !== -1) {
      // Atualiza o grupo na lista local, garantindo que o objeto 'owner' seja o SimpleUser correto
      allGroups.value[index] = { ...savedGroup, owner: allMockSimpleUsers.find(u => u.uuid === savedGroup.owner_uuid) };
    }
  } else { // Criando
    const owner = currentUser ? allMockSimpleUsers.find(u => u.uuid === currentUser.uuid) : allMockSimpleUsers[0]; // Fallback
    const newGroupWithOwner = {
        ...savedGroup,
        uuid: savedGroup.uuid || `mock-group-${Date.now()}`, // Garante UUID se não vier do form
        owner_uuid: owner?.uuid || 'unknown-owner',
        owner: owner,
        participants_count: 0, // Inicializa contadores
        tasks_count: 0
    };
    allGroups.value.unshift(newGroupWithOwner);
  }
  closeGroupDialog();
  // Aqui você pode adicionar um snackbar/toast de sucesso
  // Ex: snackbar.add({ title: 'Grupo salvo com sucesso!', color: 'success' })
};

const confirmDeleteGroup = (groupId: string) => {
  groupToDelete.value = allGroups.value.find(g => g.uuid === groupId) || null;
  if (groupToDelete.value) {
    deleteConfirmDialog.value = true;
  }
};

const executeDeleteGroup = () => {
  if (groupToDelete.value) {
    allGroups.value = allGroups.value.filter(g => g.uuid !== groupToDelete.value!.uuid);
    console.log('Grupo excluído:', groupToDelete.value!.uuid);
    // Adicionar notificação de sucesso
  }
  deleteConfirmDialog.value = false;
  groupToDelete.value = null;
};
</script>

<style scoped>
.text-disabled {
   color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}
.font-italic {
  font-style: italic;
}
</style>
