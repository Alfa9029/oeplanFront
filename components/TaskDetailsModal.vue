<template>
  <v-dialog
    :model-value="show"
    @update:model-value="handleClose"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="handleClose"></v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text style="max-height: 70vh;">
        <v-form ref="taskFormRef" @submit.prevent="submitForm">
          <v-text-field
            v-model="formData.title"
            label="Título da Tarefa*"
            variant="outlined"
            density="compact"
            class="mb-3"
            :rules="[rules.required, rules.maxLength(100)]"
            counter="100"
            autofocus
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Descrição*"
            variant="outlined"
            density="compact"
            rows="4"
            class="mb-3"
            :rules="[rules.required, rules.maxLength(500)]"
            counter="500"
          ></v-textarea>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status*"
                variant="outlined"
                density="compact"
                class="mb-3"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.priority"
                :items="priorityOptions"
                label="Prioridade*"
                variant="outlined"
                density="compact"
                class="mb-3"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.visibility"
                :items="visibilityOptions"
                label="Visibilidade*"
                variant="outlined"
                density="compact"
                class="mb-3"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.due_date"
                label="Prazo (Opcional)"
                type="date"
                variant="outlined"
                density="compact"
                class="mb-3"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

           <v-select
            v-model="formData.assigned_to_uuid"
            :items="assignableUsers"
            item-title="displayName"
            item-value="uuid"
            label="Atribuir para*"
            variant="outlined"
            density="compact"
            class="mb-3"
            :rules="[rules.required]"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.email"></v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model="formData.category"
            label="Categoria (Opcional)"
            variant="outlined"
            density="compact"
            class="mb-3"
            :rules="[rules.maxLength(50)]"
            counter="50"
          ></v-text-field>

          <v-combobox
            v-model="formData.tags"
            label="Tags (Opcional, pressione Enter para adicionar)"
            multiple
            chips
            clearable
            closable-chips
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-combobox>

        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleClose">Cancelar</v-btn>
        <v-btn color="primary" variant="elevated" @click="submitForm" :loading="isSubmitting">
          {{ isEditing ? 'Salvar Alterações' : 'Criar Tarefa' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import type { PropType } from 'vue';
import type { Task, SimpleUser, TaskVisibility, TaskStatus, TaskPriority } from '~/shared/types/task'
import { allMockSimpleUsers } from '~/shared/data/mockData'; // Para popular o select de usuários
import { useAuth } from '~/composables/auth';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  taskToEdit: {
    type: Object as PropType<Task | null>,
    default: null,
  },
});

const emit = defineEmits(['update:show', 'save']);

const { loggedInUser } = useAuth(); // Para pegar o usuário que está criando/editando

const taskFormRef = ref<any>(null); // Referência para o v-form
const isSubmitting = ref(false);

// Tipos para as opções dos selects
const visibilityOptions: TaskVisibility[] = ['Pública', 'Privada', 'Grupo'];
const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorityOptions: TaskPriority[] = ['Baixa', 'Média', 'Alta'];

// Usuários disponíveis para atribuição
const assignableUsers = computed(() =>
  allMockSimpleUsers.map(u => ({ ...u, displayName: `${u.first_name} ${u.last_name}` }))
);

// Estado do formulário
const initialFormData = () => ({
  title: '',
  description: '',
  status: 'To Do' as TaskStatus,
  priority: 'Média' as TaskPriority,
  visibility: 'Privada' as TaskVisibility,
  due_date: null as string | null,
  assigned_to_uuid: null as string | null, // Armazena o UUID do usuário atribuído
  category: '',
  tags: [] as string[],
});

const formData = reactive(initialFormData());

const isEditing = computed(() => !!props.taskToEdit);

// Regras de validação
const rules = {
  required: (value: any) => !!value || 'Este campo é obrigatório.',
  maxLength: (max: number) => (value: string) => (value && value.length <= max) || `Máximo de ${max} caracteres.`,
};

// Observa mudanças na prop taskToEdit para preencher o formulário
watch(() => props.taskToEdit, (newTask) => {
  if (newTask) {
    formData.title = newTask.title;
    formData.description = newTask.description;
    formData.status = newTask.status;
    formData.priority = newTask.priority;
    formData.visibility = newTask.visibility;
    formData.due_date = newTask.due_date ? newTask.due_date.split('T')[0] : null; // Formato YYYY-MM-DD para input date
    formData.assigned_to_uuid = newTask.assigned_to.uuid;
    formData.category = newTask.category || '';
    formData.tags = newTask.tags ? [...newTask.tags] : [];
  } else {
    // Resetar formulário se não houver taskToEdit (modo de criação)
    Object.assign(formData, initialFormData());
    // Define um usuário padrão se estiver criando e houver usuários disponíveis
    if (assignableUsers.value.length > 0 && !isEditing.value) {
        formData.assigned_to_uuid = assignableUsers.value[0].uuid;
    }
  }
  // Reseta a validação do formulário ao mudar taskToEdit ou ao abrir para nova tarefa
  if (taskFormRef.value) {
    taskFormRef.value.resetValidation();
  }
}, { immediate: true });


const handleClose = () => {
  emit('update:show', false);
  // É bom resetar o formulário ao fechar, especialmente se não foi salvo
   Object.assign(formData, initialFormData());
   if (taskFormRef.value) {
    taskFormRef.value.resetValidation();
  }
};

async function submitForm() {
  if (!taskFormRef.value) return;
  const { valid } = await taskFormRef.value.validate();

  if (valid) {
    isSubmitting.value = true;
    const assignedToUser = allMockSimpleUsers.find(u => u.uuid === formData.assigned_to_uuid);
    const assigningUser = loggedInUser.value || allMockSimpleUsers[0]; // Fallback se não houver usuário logado

    if (!assignedToUser) {
      console.error("Usuário atribuído não encontrado!");
      // Adicionar feedback ao usuário aqui (ex: snackbar)
      isSubmitting.value = false;
      return;
    }
     if (!assigningUser) {
      console.error("Usuário que está atribuindo (criador) não encontrado!");
      isSubmitting.value = false;
      return;
    }


    const taskDataToSave: Omit<Task, 'uuid' | 'created_at' | 'updated_at'> & { uuid?: string } = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      visibility: formData.visibility,
      due_date: formData.due_date || null,
      assigned_to: assignedToUser,
      assigned_by: { // Convertendo User para SimpleUser
        uuid: assigningUser.uuid,
        username: assigningUser.username,
        first_name: assigningUser.first_name,
        last_name: assigningUser.last_name,
        email: assigningUser.email,
      },
      category: formData.category || undefined,
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    };

    if (isEditing.value && props.taskToEdit) {
      taskDataToSave.uuid = props.taskToEdit.uuid; // Mantém o UUID e datas originais para edição
    }

    emit('save', taskDataToSave);
    // O fechamento do modal e reset do form pode ser feito pelo componente pai após o 'save'
    // ou aqui, dependendo da preferência.
    // handleClose(); // Comentado para permitir que o pai controle o fechamento após salvar
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
