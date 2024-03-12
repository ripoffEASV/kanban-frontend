<script setup lang="ts">
import { ref } from 'vue'
import * as GLOBAL from '../components/Globals/GLOBALS.js'
import Cookies from 'js-cookies'

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
      credentials: 'include',
      body: JSON.stringify(data) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        console.log(data.cookie)
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

function getCookie(name: string) {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    // Check if the cookie starts with the specified name
    if (cookie.startsWith(name + '=')) {
      // Return the cookie value
      return cookie.substring(name.length + 1)
    }
  }
  // Return null if the cookie is not found
  return null
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
