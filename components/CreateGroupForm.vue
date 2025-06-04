<template>
  <v-card>
    <v-card-title class="pa-4">
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4" style="max-height: 75vh; overflow-y: auto;">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Título do Grupo*"
                :rules="[rules.required, rules.minLength(formData.title ?? '', 3)]"
                variant="outlined"
                density="comfortable"
                autofocus
                counter="100"
                maxlength="100"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Descrição do Grupo"
                variant="outlined"
                density="comfortable"
                rows="3"
                counter="500"
                maxlength="500"
                :rules="[rules.maxLength(formData.description ?? '', 500)]"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.category"
                label="Categoria"
                variant="outlined"
                density="comfortable"
                placeholder="Ex: Académico, Pesquisa, Administrativo"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
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
            
            <v-col cols="12">
              <v-combobox
                v-model="formData.tags"
                label="Tags do Grupo"
                multiple
                chips
                clearable
                closable-chips
                variant="outlined"
                density="comfortable"
                placeholder="Adicione tags e pressione Enter"
                hint="Pressione Enter para adicionar uma nova tag. Ex: pesquisa, inovacao"
              ></v-combobox>
            </v-col>

            <!-- Funcionalidade de adicionar participantes por e-mail (simplificada para este exemplo) -->
            <!-- Numa aplicação real, isto seria mais complexo, envolvendo pesquisa de utilizadores, convites, etc. -->
            <v-col cols="12">
               <v-textarea
                v-model="participantEmailsInput"
                label="Adicionar Participantes por E-mail (separados por vírgula)"
                variant="outlined"
                density="comfortable"
                rows="2"
                placeholder="email1@exemplo.com, email2@exemplo.com"
                hint="Apenas para fins de demonstração. A lógica de convite/adição não está implementada."
              ></v-textarea>
            </v-col>

            <!-- Campo para selecionar o proprietário (apenas para fins de mock, se necessário) -->
            <!-- <v-col cols="12" v-if="!isEditing"> -->
            <!--   <v-select -->
            <!--     v-model="formData.owner_uuid" -->
            <!--     :items="usersList" -->
            <!--     item-title="fullName" -->
            <!--     item-value="uuid" -->
            <!--     label="Proprietário do Grupo*" -->
            <!--     :rules="[rules.required]" -->
            <!--     variant="outlined" -->
            <!--     density="comfortable" -->
            <!--   ></v-select> -->
            <!-- </v-col> -->

          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
      <v-btn color="primary" variant="flat" @click="submitForm" :loading="loading">
        {{ isEditing ? 'Salvar Alterações' : 'Criar Grupo' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { Group } from '~/shared/types/group';
import type { SimpleUser } from '~/shared/types/auth/user';
import { useAuth } from '~/composables/auth'; // Para obter o utilizador logado como proprietário

const props = defineProps<{
  initialGroupData?: Group | null; // Dados para edição
  usersList: SimpleUser[]; // Lista de utilizadores para o select de proprietário (se necessário)
}>();

const emit = defineEmits(['close', 'group-saved']);

const { loggedInUser } = useAuth(); // Para obter o utilizador logado

const formRef = ref<any>(null); // Referência ao v-form para validação
const loading = ref(false);

const visibilityOptions = [
  { text: 'Pública', value: 'Pública' as Group['visibility'] },
  { text: 'Privada', value: 'Privada' as Group['visibility'] },
  { text: 'Restrita', value: 'Restrita' as Group['visibility'] },
];

const defaultFormData = (): Partial<Group> & { owner_uuid?: string } => ({
  title: '',
  description: '',
  category: '',
  visibility: 'Privada', // Visibilidade padrão
  tags: [],
  owner_uuid: loggedInUser.value?.uuid, // Proprietário padrão é o utilizador logado
  // participants_emails: [], // Para os emails dos participantes
});

const formData = reactive(defaultFormData());
const participantEmailsInput = ref(''); // Para o campo de texto dos emails dos participantes

const isEditing = computed(() => !!props.initialGroupData);
const formTitle = computed(() => isEditing.value ? 'Editar Grupo' : 'Criar Novo Grupo');

// Regras de validação do Vuetify
const rules = {
  required: (value: any) => !!value || 'Campo obrigatório.',
  minLength: (value: string, min: number) => (value && value.length >= min) || `Mínimo de ${min} caracteres.`,
  maxLength: (value: string, max: number) => (!value || value.length <= max) || `Máximo de ${max} caracteres.`,
  email: (value: string) => {
    if (!value) return true; // Permite campo vazio se não for obrigatório
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'E-mail inválido.';
  },
};

// Observa mudanças nos dados iniciais para preencher o formulário em modo de edição
watch(() => props.initialGroupData, (newData) => {
  if (newData) {
    Object.assign(formData, {
        ...newData,
        // Se os participantes forem geridos como uma lista de emails no formulário
        // participantEmailsInput.value = newData.participants?.map(p => p.email).join(', ') || '';
    });
    // Se o proprietário puder ser editado ou for diferente do utilizador logado
    // formData.owner_uuid = newData.owner_uuid;
  } else {
    Object.assign(formData, defaultFormData());
    participantEmailsInput.value = '';
  }
}, { immediate: true });


const closeDialog = () => {
  emit('close');
  formRef.value?.resetValidation();
  Object.assign(formData, defaultFormData());
  participantEmailsInput.value = '';
};

const submitForm = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();

  if (valid) {
    loading.value = true;
    const currentUser = loggedInUser.value;

    if (!currentUser) {
        console.error("Utilizador não está logado. Não é possível criar/editar grupo.");
        // Adicionar feedback de erro
        loading.value = false;
        return;
    }

    // Processar emails dos participantes (apenas para demonstração)
    const participantEmails = participantEmailsInput.value.split(',')
                                .map(email => email.trim())
                                .filter(email => email.length > 0 && rules.email(email) === true);
    console.log("E-mails dos participantes a serem processados (mock):", participantEmails);


    const groupDataToSave: Group = {
      uuid: isEditing.value ? props.initialGroupData!.uuid : `mock-group-uuid-${Date.now()}`,
      title: formData.title!,
      description: formData.description || '',
      category: formData.category || '',
      visibility: formData.visibility as Group['visibility'],
      tags: formData.tags || [],
      owner_uuid: isEditing.value ? props.initialGroupData!.owner_uuid : currentUser.uuid, // Proprietário é o utilizador logado ao criar
      // owner: // O objeto owner seria preenchido no backend ou ao listar
      created_at: isEditing.value ? props.initialGroupData!.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // participants_count e tasks_count seriam calculados ou viriam do backend
    };

    // Simulação de chamada API
    console.log('Dados do grupo a salvar:', groupDataToSave);
    await new Promise(resolve => setTimeout(resolve, 1000));

    emit('group-saved', groupDataToSave);
    loading.value = false;
    // closeDialog(); // O pai (groups/index.vue) chamará closeDialog após o evento
  } else {
    console.log('Formulário de grupo inválido');
  }
};

// Adiciona fullName aos utilizadores para exibição no v-select (se for usar para proprietário)
// const usersListForSelect = computed(() => {
//   return props.usersList.map(user => ({
// Regra de validação de e-mail (exemplo simples)
// (Já incluída dentro do objeto rules acima)
rules.email = (value: string) => {
  if (!value) return true; // Permite campo vazio se não for obrigatório
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || 'E-mail inválido.';
};

</script>

<style scoped>
/* Estilos para o formulário se necessário */
.v-card-text {
  overflow-y: auto;
}
</style>
