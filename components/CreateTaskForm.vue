<template>
  <v-card>
    <v-card-title class="pa-4">
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4" style="max-height: 70vh; overflow-y: auto;">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Título da Tarefa*"
                :rules="[rules.required, rules.minLength(formData.title ?? '', 3)]"
                variant="outlined"
                density="comfortable"
                autofocus
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Descrição"
                variant="outlined"
                density="comfortable"
                rows="4"
                counter="255"
                :rules="[rules.maxLength(formData.description ?? '', 255)]"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.due_date"
                label="Data de Entrega (Prazo)"
                type="date"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.priority"
                :items="priorityOptions"
                item-title="text"
                item-value="value"
                label="Prioridade*"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6">
               <v-select
                v-model="formData.assigned_to_uuid"
                :items="usersList"
                item-title="fullName"
                item-value="uuid"
                label="Responsável*"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.fullName" :subtitle="item.raw.email"></v-list-item>
                </template>
                 <template v-slot:selection="{ item }">
                  <span>{{ item.raw.fullName }}</span>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.category"
                label="Categoria"
                variant="outlined"
                density="comfortable"
                placeholder="Ex: Académico, Ensino"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="formData.tags"
                label="Tags"
                multiple
                chips
                clearable
                closable-chips
                variant="outlined"
                density="comfortable"
                placeholder="Adicione tags e pressione Enter"
                hint="Pressione Enter para adicionar uma nova tag"
              ></v-combobox>
            </v-col>
             <v-col cols="12">
              <v-select
                v-model="formData.visibility"
                :items="visibilityOptions"
                item-title="text"
                item-value="value"
                label="Visibilidade*"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
      <v-btn color="primary" variant="flat" @click="submitForm" :loading="loading">
        {{ isEditing ? 'Salvar Alterações' : 'Criar Tarefa' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import type { Task } from '~/shared/types/task';
import type { User, SimpleUser } from '~/shared/types/auth/user';
import { useAuth } from '~/composables/auth';

const props = defineProps<{
  initialTaskData?: Task | null; // Dados para edição
  usersList: SimpleUser[]; // Lista de utilizadores para o select de responsável
}>();

const emit = defineEmits(['close', 'task-saved']);

const { loggedInUser } = useAuth(); // Para obter o utilizador logado como assigned_by

const formRef = ref<any>(null); // Referência ao v-form para validação
const loading = ref(false);

const priorityOptions = [
  { text: 'Baixa', value: 'Baixa' as Task['priority'] },
  { text: 'Média', value: 'Média' as Task['priority'] },
  { text: 'Alta', value: 'Alta' as Task['priority'] },
];

const visibilityOptions = [
  { text: 'Privada', value: 'Privada' as Task['visibility'] },
  { text: 'Grupo', value: 'Grupo' as Task['visibility'] },
  { text: 'Pública', value: 'Pública' as Task['visibility'] },
];

const defaultFormData = (): Partial<Task> & { assigned_to_uuid?: string } => ({
  title: '',
  description: '',
  due_date: null, // Inicializa como null para o date picker
  priority: 'Média',
  assigned_to_uuid: undefined,
  category: '',
  tags: [],
  visibility: 'Privada',
  status: 'To Do', // Status inicial por defeito
});

const formData = reactive(defaultFormData());

const isEditing = computed(() => !!props.initialTaskData);
const formTitle = computed(() => isEditing.value ? 'Editar Tarefa' : 'Criar Nova Tarefa');

// Regras de validação do Vuetify
const rules = {
  required: (value: any) => !!value || 'Campo obrigatório.',
  minLength: (value: string, min: number) => (value && value.length >= min) || `Mínimo de ${min} caracteres.`,
  maxLength: (value: string, max: number) => (!value || value.length <= max) || `Máximo de ${max} caracteres.`,
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail deve ser válido.',
};

// Observa mudanças nos dados iniciais para preencher o formulário em modo de edição
watch(() => props.initialTaskData, (newData) => {
  if (newData) {
    Object.assign(formData, {
      ...newData,
      assigned_to_uuid: newData.assigned_to?.uuid, // Mapeia o objeto para o UUID
      due_date: newData.due_date ? newData.due_date.split('T')[0] : null, // Formata data para input type="date"
    });
  } else {
    Object.assign(formData, defaultFormData()); // Reseta para o padrão ao criar nova
  }
}, { immediate: true });


const closeDialog = () => {
  emit('close');
  formRef.value?.resetValidation(); // Limpa a validação do formulário
  Object.assign(formData, defaultFormData()); // Reseta os dados do formulário
};

const submitForm = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();

  if (valid) {
    loading.value = true;
    const assignedToUser = props.usersList.find(u => u.uuid === formData.assigned_to_uuid);
    const currentUser = loggedInUser.value as SimpleUser; // Utilizador logado

    if (!assignedToUser || !currentUser) {
      console.error("Utilizador responsável ou criador não encontrado/logado.");
      // Adicionar feedback de erro para o utilizador
      loading.value = false;
      return;
    }

    const taskDataToSave: Task = {
      uuid: isEditing.value ? props.initialTaskData!.uuid : `mock-uuid-${Date.now()}`,
      title: formData.title!,
      description: formData.description || '',
      due_date: formData.due_date || null,
      priority: formData.priority as Task['priority'],
      status: isEditing.value ? props.initialTaskData!.status : 'To Do',
      visibility: formData.visibility as Task['visibility'],
      category: formData.category || '',
      tags: formData.tags || [],
      assigned_to: assignedToUser,
      assigned_by: currentUser, // Utilizador logado que está a criar/editar
      created_at: isEditing.value ? props.initialTaskData!.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Simulação de chamada API
    console.log('Dados da tarefa a salvar:', taskDataToSave);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay

    emit('task-saved', taskDataToSave);
    loading.value = false;
    // closeDialog(); // O pai (dashboard) chamará closeDialog após o evento
  } else {
    console.log('Formulário inválido');
  }
};

// Adiciona fullName aos utilizadores para exibição no v-select
const usersList = computed(() => {
  return props.usersList.map(user => ({
    ...user,
    fullName: `${user.first_name} ${user.last_name}`
  }));
});

</script>

<style scoped>
/* Estilos para o formulário se necessário */
.v-card-text {
  overflow-y: auto;
}
</style>
