<template>
  <v-navigation-drawer
    v-model="drawerModel"
    app
    :permanent="$vuetify.display.mdAndUp"
    :temporary="$vuetify.display.smAndDown"
    color="surface"
    width="260"
  >
    <v-list-item class="pa-4">
      <template v-slot:prepend>
        <img src="assets/icons/logo.svg" alt="OEPlan Logo" height="40" class="mr-3" />
      </template>
      <v-list-item-title class="text-h6 font-weight-bold primary--text">
        OEPlan
      </v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        exact
        active-class="primary--text"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-list-item
          to="/help"
          prepend-icon="mdi-help-circle-outline"
          title="Ajuda"
          exact
          active-class="primary--text"
        ></v-list-item>
        <v-btn block color="primary" variant="tonal" @click="handleLogout" class="mt-2">
          Sair
          <v-icon end>mdi-logout</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '~/composables/auth';
import { useRouter } from 'vue-router';

const props = defineProps<{
  modelValue: boolean; // Para controlar o estado do drawer pelo v-model no layout
}>();
const emit = defineEmits(['update:modelValue']);

const { logout } = useAuth();
const router = useRouter();

// Sincroniza o estado do drawer com o v-model
const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const navigationItems = [
  { title: 'Painel', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
  { title: 'Grupos', icon: 'mdi-account-group-outline', to: '/groups' },
  { title: 'Tarefas Arquivadas', icon: 'mdi-archive-outline', to: '/archived' },
  { title: 'Notificações', icon: 'mdi-bell-outline', to: '/notifications' },
  // Adicione mais itens conforme necessário
];

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>

<style scoped>
.primary--text {
  color: rgb(var(--v-theme-primary));
}
/* Ajustes finos, se necessário */
</style>
