<template>
  <v-card
    class="group-card fill-height d-flex flex-column"
    hover
    @click="$emit('click', group.uuid)"
    elevation="3"
    rounded="lg"
    variant="outlined"
  >
    <v-card-item class="pb-1 pt-3 px-3">
      <template #prepend>
        <v-icon :color="visibilityColor(group.visibility)" size="small" class="mr-2 mt-n1">
          {{ visibilityIcon(group.visibility) }}
        </v-icon>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-0" style="line-height: 1.4rem;">
        {{ group.title }}
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
              aria-label="Mais ações para o grupo"
            ></v-btn>
          </template>
          <v-list density="compact" nav>
            <v-list-item @click.stop="emitAction('viewGroup', group.uuid)" prepend-icon="mdi-eye-outline" value="view">
              <v-list-item-title>Ver Detalhes</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="emitAction('editGroup', group.uuid)" prepend-icon="mdi-pencil-outline" value="edit">
              <v-list-item-title>Editar Grupo</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item @click.stop="emitAction('deleteGroup', group.uuid)" base-color="error" prepend-icon="mdi-delete-outline" value="delete">
              <v-list-item-title>Excluir Grupo</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-card-item>

    <v-card-text class="pt-1 pb-2 px-3 flex-grow-1">
      <p v-if="group.category" class="text-caption text-medium-emphasis mb-1">
        Categoria: {{ group.category }}
      </p>
      <p v-if="group.description" class="text-body-2 text-medium-emphasis mb-2 line-clamp-3" :title="group.description">
        {{ group.description }}
      </p>
      <p v-else class="text-body-2 text-disabled font-italic mb-2">
        Sem descrição.
      </p>

      <div v-if="group.tags && group.tags.length" class="mt-auto pt-2">
        <v-chip
          v-for="tag in group.tags"
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

    <v-divider></v-divider>
    <v-card-actions class="px-3 py-2 text-caption text-medium-emphasis">
      <v-icon size="small" class="mr-1">mdi-account-multiple-outline</v-icon>
      <span>{{ group.participants_count || 0 }} Participantes</span>
      <v-spacer></v-spacer>
      <v-icon size="small" class="mr-1">mdi-format-list-checks</v-icon>
      <span>{{ group.tasks_count || 0 }} Tarefas</span>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Group } from '~/shared/types/group'; // Certifique-se que este caminho está correto

const props = defineProps<{
  group: Group;
}>();

const emit = defineEmits(['click', 'viewGroup', 'editGroup', 'deleteGroup']);

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
    case 'pública': return 'mdi-earth'; // Ou mdi-eye, mdi-web
    case 'privada': return 'mdi-lock-outline';
    case 'restrita': return 'mdi-account-group-outline'; // Ou mdi-account-multiple-outline
    default: return 'mdi-help-circle-outline';
  }
};

const emitAction = (action: string, groupId: string) => {
  console.log(`[GroupCard] Ação: '${action}', Grupo ID: ${groupId}`);
  emit(action as any, groupId);
};
</script>

<style scoped>
.group-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  border-width: 1px;
}
.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15) !important; /* Aumenta a sombra no hover */
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.8em; /* Ajuste conforme line-height (ex: 1.6em * 3) */
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

.v-card-item > .v-card-item__append {
  align-self: flex-start;
  padding-left: 8px;
}
</style>
