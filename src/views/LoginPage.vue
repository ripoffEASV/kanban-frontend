<script setup lang="ts">
import { ref } from 'vue'
import * as GLOBAL from '../components/Globals/GLOBALS.js'

const email = ref()
const password = ref()

async function login() {
  try {
    console.log(email.value)
    console.log(password.value)

    const data = {
      email: email.value,
      password: password.value
    }

    await fetch(GLOBAL.URL + 'users/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        let token = data.data
        localStorage.setItem('auth-token', '')
        localStorage.setItem('auth-token', token.data)
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error.message)
  }
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
        <button type="button" @click="login()" class="btn btn-primary">Login</button>
      </div>
    </div>
  </div>
</template>
