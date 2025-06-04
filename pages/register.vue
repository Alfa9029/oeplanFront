<template>
  <v-container fluid class="register-container">
    <v-row align="center" justify="center" class="fill-height">
       <v-col cols="12" md="8" lg="6" class="d-none d-md-flex align-center justify-center left-pane">
          <div class="text-center">
            <img src="assets/icons/logo.svg" alt="Logo OEPlan" style="width: 80px; margin-bottom: 16px;" />
            <h1 class="text-h4 font-weight-bold mb-2" style="color: white;">OEPlan</h1>
            <p class="text-subtitle-1" style="color: #e0e0e0;">
              Crie sua conta para gerenciar atividades docentes.
            </p>
          </div>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex align-center justify-center right-pane">
        <v-card class="pa-sm-6 pa-md-8" elevation="12" max-width="480" width="100%">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            Criar Conta
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onRegisterSubmit">
              <v-text-field
                v-model="registerForm.firstName"
                label="Nome"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="registerForm.lastName"
                label="Sobrenome"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="registerForm.email"
                label="Email"
                type="email"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="registerForm.password"
                label="Senha"
                type="password"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="registerForm.confirmPassword"
                label="Confirmar Senha"
                type="password"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>

              <v-btn type="submit" block color="primary" size="large" :loading="loading">
                Cadastrar
              </v-btn>
            </v-form>
            <div class="text-center mt-6">
              <p class="text-body-2">
                Já tem uma conta?
                <NuxtLink to="/login" class="text-primary font-weight-medium" style="text-decoration: none;">Faça Login</NuxtLink>
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// import { useAuth } from '~/composables/auth';

definePageMeta({
  layout: false, // Layout sem header/sidebar
});
useHead({
  title: 'Cadastro - OEPlan',
});

const router = useRouter();
// const { register } = useAuth(); // Supondo uma função register no seu composable
const loading = ref(false);

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

async function onRegisterSubmit() {
  if (registerForm.password !== registerForm.confirmPassword) {
    alert("As senhas não coincidem!"); // Melhorar feedback
    return;
  }
  loading.value = true;
  try {
    // Lógica de cadastro
    // await register({
    //   username: registerForm.email, // Ou um username separado
    //   email: registerForm.email,
    //   password: registerForm.password,
    //   first_name: registerForm.firstName,
    //   last_name: registerForm.lastName,
    //   role: 'Professor' // ou um seletor de role
    // });
    console.log("Dados de cadastro:", registerForm);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API
    alert("Cadastro realizado com sucesso! Faça login."); // Melhorar feedback
    router.push('/login');
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Ocorreu um erro durante o cadastro."); // Melhorar feedback
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
   background-color: #0e1321;
}
.fill-height {
  min-height: 100vh;
}
.left-pane {
  background-color: #04060f;
  padding: 32px;
   min-height: 100vh;
}
.right-pane {
   min-height: 100vh;
   padding: 32px;
}
.v-card {
  border-radius: 8px !important;
}
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
