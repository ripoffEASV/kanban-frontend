<script setup lang="ts">
import { computed, ref } from 'vue'
import userCrud from './modules/loginCRUD'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from '@/router'

const { signUpUser } = userCrud()

const passwordsMatch = computed(() => formData.value.password === formData.value.repeatPassword)

// Reactive state
const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  repeatPassword: ''
})

// Method
async function submitForm() {
  await signUpUser(
    formData.value.firstName,
    formData.value.lastName,
    formData.value.username,
    formData.value.email,
    formData.value.password
  ).then((success) => {
    if (success) {
      router.push('/login')
    }
  })
}

const showPassword = ref({
  password: false,
  confirmPassword: false
})

const togglePasswordVisibility = (fieldName) => {
  showPassword.value[fieldName] = !showPassword.value[fieldName]
}
</script>

<template>
  <div class="signup-form">
    <h2>Signup Form</h2>
    <form @submit.prevent="submitForm">
      <section class="namesContainer">
        <div class="form-group">
          <label for="fName">First name:</label>
          <input type="text" id="fName" v-model="formData.firstName" required />
        </div>
        <div class="form-group">
          <label for="lName">Last name:</label>
          <input type="text" id="lName" v-model="formData.lastName" required />
        </div>
      </section>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="formData.username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <section class="d-flex flex-row position-relative">
          <input
            autocomplete="new-password"
            :type="showPassword.password ? 'text' : 'password'"
            id="password"
            v-model="formData.password"
            required
            minlength="3"
          />
          <div
            class="position-absolute eyePos"
            type="button"
            @click="togglePasswordVisibility('password')"
          >
            <i
              :class="showPassword.password ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'"
              class="text-black"
            ></i>
          </div>
        </section>
      </div>
      <div class="form-group position-relative">
        <label for="newPassword">Confirm password:</label>
        <section class="d-flex flex-row position-relative">
          <input
            autocomplete="new-password"
            :type="showPassword.confirmPassword ? 'text' : 'password'"
            id="newPassword"
            v-model="formData.repeatPassword"
            required
            minlength="3"
          />
          <div
            class="position-absolute eyePos"
            type="button"
            @click="togglePasswordVisibility('confirmPassword')"
          >
            <i
              :class="showPassword.confirmPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'"
              class="text-black"
            ></i>
          </div>
        </section>

        <div v-if="!passwordsMatch" class="errorMessage position-absolute">
          Passwords do not match.
        </div>
      </div>
      <button type="submit">Signup</button>
    </form>
  </div>
</template>

<style scoped>
.signup-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.signup-form h2 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: white;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.namesContainer {
  display: flex;
  gap: 1rem;
}

.relative {
  position: relative;
}
.errorMessage {
  color: red;
  top: 0;
  right: 0;
}
.text-black {
  color: black;
}
.eyePos {
  top: 50%;
  right: 2.5%;
  transform: translateY(-50%);
}
</style>
