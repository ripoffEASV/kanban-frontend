<script setup lang="ts">
import { ref } from 'vue'
import * as Login from '../components/modules/loginCRUD.js'

const email = ref('')
const password = ref('')

const login = async () => {
  await Login.loginUser(email.value, password.value)
}
</script>

<template>
  <div class="loginContainer my-auto mx-auto px-5 py-5 border rounded my-auto d-flex flex-column">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2">
        <span>Email</span>
      </div>
      <div class="d-flex flex-row">
        <input type="email" v-model="email" class="form-control" />
      </div>
    </div>

    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2">
        <span>Password</span>
      </div>
      <div class="d-flex flex-row">
        <input type="password" v-model="password" class="form-control" />
      </div>
    </div>
    <div class="d-flex flex-column">
      <div class="d-flex flex-row py-2 justify-content-center">
        <button type="button" @click="login" class="btn btn-primary">Login</button>
      </div>
    </div>
  </div>
</template>
