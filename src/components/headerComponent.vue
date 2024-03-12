<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import * as GLOBAL from './Globals/GLOBALS.js'

const isLoggedIn = ref(false)

const checkLogin = () => {
  // Check for the presence of an authentication token
  if (localStorage.getItem('auth-token') !== null) {
    isLoggedIn.value = true
  }
}

const logout = async () => {
  localStorage.removeItem('auth-token')
  isLoggedIn.value = false

  // try {
  //   const token = localStorage.getItem('auth-token')
  //   const response = await fetch(GLOBAL.URL + 'users/logout/' + token, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'include'
  //   })

  //   const data = await response.json()
  //   console.log(data)

  //   // Assuming the server returns a successful logout response,
  //   // you may want to clear the token and update the isLoggedIn value.
  //   localStorage.removeItem('auth-token')
  //   isLoggedIn.value = false

  //   // Optionally, redirect to the login page or perform other actions.
  //   // const router = useRouter()
  //   // await router.push('/')
  // } catch (error) {
  //   console.error(error)
  //   // Handle errors, show an alert, or perform other actions as needed.
  // }
}

onMounted(() => {
  checkLogin()
})
</script>

<template>
  <nav class="d-flex flex-row py-2 border header_component_nav justify-content-center">
    <div class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/" class="text-white">Home</RouterLink>
      </button>
    </div>
    <div class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/organizations" class="text-white">Organizations</RouterLink>
      </button>
    </div>
    <div class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/projects" class="text-white">Projects</RouterLink>
      </button>
    </div>
    <div class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/currentProject" class="text-white">Current</RouterLink>
      </button>
    </div>
    <div v-if="!isLoggedIn" class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/login" class="text-white">login</RouterLink>
      </button>
    </div>
    <div v-if="!isLoggedIn" class="nav_item">
      <button type="button" class="btn btn-primary">
        <RouterLink to="/signup">Signup</RouterLink>
      </button>
    </div>
    
    <div v-if="isLoggedIn" class="nav_item">
      <button type="button" class="btn btn-primary" @click="logout">Logout</button>
    </div>

    <!-- <RouterLink to="/about">About</RouterLink> -->
  </nav>
</template>
