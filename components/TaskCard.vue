<template>
  <v-card
    class="task-card mb-3"
    hover
    @click="emit('click', task.uuid)"
    elevation="3"
    rounded="lg"
    variant="outlined"
  >
    <v-card-item class="pb-1 pt-3 px-3">
      <template #prepend>
        <v-icon :color="priorityColor(task.priority)" size="small" class="mr-1 mt-n1">
          {{ priorityIcon(task.priority) }}
        </v-icon>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-0" style="line-height: 1.4rem;">
        {{ task.title }}
      </v-card-title>
      <template #append>
        <v-menu location="bottom end" open-on-hover>
          <template v-slot:activator="{ props: menuProps }">
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="menuProps"
              @click.stop
              aria-label="Mais ações"
            ></v-btn>
          </template>
          <v-list density="compact" nav>
            <v-list-item @click.stop="emitAction('viewDetails', task.uuid)" prepend-icon="mdi-eye-outline" value="view">
              <v-list-item-title>Ver Detalhes</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="emitAction('editTask', task.uuid)" prepend-icon="mdi-pencil-outline" value="edit">
              <v-list-item-title>Editar Tarefa</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-subheader>MOVER PARA</v-list-subheader>
            <v-list-item v-if="task.status !== 'To Do'" @click.stop="emitAction('moveToTodo', task.uuid)" value="todo">
              <v-list-item-title>A Fazer</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="task.status !== 'In Progress'" @click.stop="emitAction('moveToInProgress', task.uuid)" value="inprogress">
              <v-list-item-title>Em Progresso</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="task.status !== 'In Review'" @click.stop="emitAction('moveToInReview', task.uuid)" value="inreview">
              <v-list-item-title>Em Revisão</v-list-item-title>
            </v-list-item>
             <v-list-item v-if="task.status !== 'Done'" @click.stop="emitAction('moveToDone', task.uuid)" value="done">
              <v-list-item-title>Concluída</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item @click.stop="emitAction('deleteTask', task.uuid)" base-color="error" prepend-icon="mdi-delete-outline" value="delete">
              <v-list-item-title>Excluir Tarefa</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-card-item>

    <v-card-text class="pt-1 pb-3 px-3">
      <p v-if="task.description" class="text-body-2 text-medium-emphasis mb-2 line-clamp-2" :title="task.description">
        {{ task.description }}
      </p>
      <p v-else class="text-body-2 text-disabled font-italic mb-2">
        Sem descrição.
      </p>

      <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
        <v-icon start size="x-small">mdi-calendar-clock-outline</v-icon>
        Prazo: {{ formatDate(task.due_date) || 'Não definido' }}
      </div>

      <div class="d-flex align-center text-caption text-medium-emphasis">
        <v-icon start size="x-small">mdi-account-outline</v-icon>
        Para: {{ task.assigned_to.first_name }} {{ task.assigned_to.last_name }}
      </div>

      <div v-if="task.tags && task.tags.length" class="mt-2">
        <v-chip
          v-for="tag in task.tags"
          :key="tag"
          size="x-small"
          class="mr-1 mb-1"
          label
          variant="tonal"
          color="secondary"
        >
          {{ tag }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Task } from '~/shared/types/task'; // Certifique-se que este caminho está correto

// Define as propriedades que o componente espera receber
const props = defineProps<{
  task: Task;
}>();

// Define os eventos que o componente pode emitir
const emit = defineEmits([
  'click', // Emitido quando o card principal é clicado
  'viewDetails',
  'editTask',
  'moveToTodo',
  'moveToInProgress',
  'moveToInReview',
  'moveToDone',
  'deleteTask'
]);

// Determina a cor do ícone de prioridade com base no valor da prioridade da tarefa
const priorityColor = (priority: string | undefined): string => {
  switch (priority?.toLowerCase()) {
    case 'alta':
      return 'error'; // Vermelho para alta prioridade (cor de erro do Vuetify)
    case 'média':
      return 'warning'; // Amarelo/Laranja para média (cor de aviso do Vuetify)
    case 'baixa':
      return 'success'; // Verde para baixa (cor de sucesso do Vuetify)
    default:
      return 'grey-darken-1'; // Cor padrão para prioridade não definida ou desconhecida
  }
};

// Determina o ícone de prioridade com base no valor da prioridade da tarefa
const priorityIcon = (priority: string | undefined): string => {
  switch (priority?.toLowerCase()) {
    case 'alta':
      return 'mdi-arrow-up-bold-circle';
    case 'média':
      return 'mdi-minus-circle';
    case 'baixa':
      return 'mdi-arrow-down-bold-circle';
    default:
      return 'mdi-help-circle-outline'; // Ícone padrão
  }
};

// Formata a string de data para o formato DD/MM/YYYY
const formatDate = (dateString: string | undefined | null): string | null => {
  if (!dateString) return null;
  try {
    // Tenta interpretar a data. Pode ser necessário ajustar se o formato de entrada for diferente.
    const date = new Date(dateString);
    // Adiciona verificação se a data é válida, pois new Date(string_invalida) não lança erro
    if (isNaN(date.getTime())) {
        // Tenta interpretar como YYYY-MM-DD se a primeira tentativa falhar
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) -1; // Mês é 0-indexado
            const day = parseInt(parts[2], 10);
            const parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
                 return parsedDate.toLocaleDateString('pt-PT'); // Formato dd/mm/yyyy
            }
        }
        return dateString; // Retorna a string original se não conseguir formatar
    }
    return date.toLocaleDateString('pt-PT'); // Formato dd/mm/yyyy
  } catch (e) {
    console.warn(`Erro ao formatar data: ${dateString}`, e);
    return dateString; // Retorna a string original em caso de erro
  }
};

// Função para emitir uma ação específica com o ID da tarefa
const emitAction = (action: string, taskId: string) => {
  console.log(`[TaskCard] Ação: '${action}', Tarefa ID: ${taskId}`);
  // O 'as any' é usado aqui para simplificar a tipagem do evento emitido.
  // Numa aplicação mais robusta, poderia definir tipos específicos para os payloads dos eventos.
  emit(action as any, taskId);
};
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  border-width: 1px;
}
.task-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* A altura máxima pode ser ajustada com base no line-height e font-size */
  max-height: 3.2em; /* Aproximadamente 2 linhas para um line-height de 1.6em */
  line-height: 1.6em; /* Ajuste conforme a tipografia do seu tema Vuetify */
}

.text-medium-emphasis {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
.text-disabled {
   color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}
.font-italic {
  font-style: italic;
}

/* Garante que o menu de ações não cause overflow no card se o título for muito longo */
.v-card-item > .v-card-item__append {
  align-self: flex-start; /* Alinha o botão de menu ao topo do item do card */
  padding-left: 8px;
}
</style>
