<script setup lang="ts">
import { ref } from 'vue';
import userCrud from './modules/loginCRUD'

const { signUpUser } = userCrud();

// Reactive state
const formData = ref({
  name: '',
  email: '',
  password: '',
});

// Method
function submitForm() {
  // Here you would handle the form submission, e.g., validate input and send it to a server
  signUpUser(formData.value.name, formData.value.email, formData.value.password);
  /* console.log('Form submitted:', formData.value);
  alert('Signup successful!'); */
}
</script>

<template>
  <div class="signup-form">
    <h2>Signup Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="formData.password" required minlength="6">
      </div>
      <button type="submit">Signup</button>
    </form>
  </div>
</template>

<style scoped>
/* Your styles here */
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
</style>
