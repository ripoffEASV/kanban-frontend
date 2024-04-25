<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import router from '../router'
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
import userCrud from '../components/modules/loginCRUD';
const { logout } = userCrud();

const logoutUser = async () => {
  logout();
}

const route = (destination: string) => {
  router.push(destination);
}

onMounted(() => {
  authStore.checkLogin();
})
</script>

<template>
  <nav class="d-flex flex-row py-2 border header_component_nav justify-content-center">
    <div class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/')">
        <RouterLink to="/" class="text-white">Home</RouterLink>
      </button>
    </div>
    <div v-if="authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/organizations')">
        <RouterLink to="/organizations" class="text-white">Organizations</RouterLink>
      </button>
    </div>
    <div v-if="authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/projects')">
        <RouterLink to="/projects" class="text-white">Projects</RouterLink>
      </button>
    </div>
    <div v-if="authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/currentProject')">
        <RouterLink to="/currentProject" class="text-white">Current</RouterLink>
      </button>
    </div>
    <div v-if="!authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/login')">
        <RouterLink to="/login" class="text-white">Login</RouterLink>
      </button>
    </div>
    <div v-if="!authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="route('/signup')">
        <RouterLink to="/signup" class="text-white">Signup</RouterLink>
      </button>
    </div>
    
    <div v-if="authStore.loggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="logoutUser">Logout</button>
    </div>
  </nav>
</template>