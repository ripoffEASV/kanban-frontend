<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../interfaces/i_user'
import ColorPicker from 'primevue/colorpicker';

const user = ref<User>({
  fName: '',
  lName: '',
  password: '',
  email: '',
  id: '',
  username: '',
  color: ''
});

const showDeleteConfirm = ref(false);

function updateUser() {
  // API call to update the user data
  alert('User updated successfully!');
}

function confirmDelete() {
  showDeleteConfirm.value = true;
}

function deleteAccount() {
  // API call to delete the user account
  alert('Account deleted successfully!');
  showDeleteConfirm.value = false;
  // Redirect or perform other cleanup here
}
</script>


<template>
    <div class="max-w-lg mx-auto p-5">
      <h1 class="text-xl font-bold mb-6">User Settings</h1>
      <form @submit.prevent="updateUser" class="space-y-4">
        <!-- First Name -->
        <div>
          <label for="fName" class="block font-medium text-gray-700">First Name:</label>
          <input id="fName" v-model="user.fName" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
  
        <!-- Last Name -->
        <div>
          <label for="lName" class="block font-medium text-gray-700">Last Name:</label>
          <input id="lName" v-model="user.lName" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>
  
        <!-- Password -->
        <div>
          <label for="password" class="block font-medium text-gray-700">Password:</label>
          <input id="password" v-model="user.password" type="password" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
        </div>

        <ColorPicker v-model="user.color" inputId="cp-hex" format="hex" class="mb-3" />
  
        <!-- Update Button -->
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Update Settings
        </button>
      </form>
  
      <!-- Delete Account Button -->
      <button @click="confirmDelete" class="mt-4 w-full bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
        Delete Account
      </button>
  
      <!-- Delete Confirmation Dialog -->
      <div v-if="showDeleteConfirm" class="mt-4 p-4 border border-gray-300 rounded bg-white">
        <p class="text-gray-800">Are you sure you want to delete your account?</p>
        <div class="flex justify-between mt-4">
          <button @click="deleteAccount" class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
            Yes, Delete It
          </button>
          <button @click="showDeleteConfirm = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </template>
  