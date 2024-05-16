<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { User } from '../interfaces/i_user'
import { useAuthStore } from '../stores/authStore'
import userCrud from '../components/modules/loginCRUD'
const { updateUser, deleteUser } = userCrud()
const authStore = useAuthStore()

interface SettingsUser {
  fName?: string
  lName?: string
  password?: string
  color?: string
}

const user = ref<User>({
  fName: '',
  lName: '',
  password: '',
  email: '',
  id: '',
  username: '',
  color: ''
})
const confirmPW = ref<string>('')

const passwordsMatch = computed(() => user.value.password === confirmPW.value)
const isPasswordTooShort = computed(() => {
  if (user.value.password === '') {
    return false
  }

  return user.value.password?.length < 3
})
const showDeleteConfirm = ref(false)

watch(
  () => authStore.getLoggedInUser(),
  (newUser) => {
    if (newUser) {
      user.value = { ...newUser }
      user.value.password = ''
    }
  },
  { immediate: true }
)

async function onUpdateUser() {
  // API call to update the user data
  if (!passwordsMatch.value || isPasswordTooShort.value) {
    return
  }
  const newUser = createUserSettingsObj()
  await updateUser(newUser)
  authStore.setLoggedInUser(user.value)
}

function createUserSettingsObj() {
  const newUser: SettingsUser = {}
  const currentUser = authStore.getLoggedInUser()
  if (user.value.password) {
    newUser.password = user.value.password
  }
  if (user.value.color && user.value.color !== currentUser?.color) {
    newUser.color = user.value.color
  }
  if (user.value.fName && user.value.fName !== currentUser?.fName) {
    newUser.fName = user.value.fName
  }
  if (user.value.lName && user.value.lName !== currentUser?.lName) {
    newUser.lName = user.value.lName
  }

  return newUser
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function deleteAccount() {
  const deleted = await deleteUser()
  if (deleted) {
    authStore.logout()
  } else {
    alert('Somehting went wrong when deleting the user!')
    showDeleteConfirm.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-5">
    <h1 class="text-xl font-bold mb-6">User Settings</h1>
    <form @submit.prevent="onUpdateUser" class="space-y-4">
      <!-- First Name -->
      <div>
        <label for="fName" class="block font-medium text-white">First Name:</label>
        <input
          id="fName"
          v-model="user.fName"
          type="text"
          class="mt-1 block w-full p-2 border !border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label for="lName" class="block font-medium text-white">Last Name:</label>
        <input
          id="lName"
          v-model="user.lName"
          type="text"
          class="mt-1 block w-full p-2 border !border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <!-- Password -->
      <div class="relative">
        <label for="password" class="block font-medium text-white">Password:</label>
        <input
          id="password"
          v-model="user.password"
          type="password"
          class="mt-1 block w-full p-2 border !border-gray-300 rounded-md shadow-sm"
        />
        <div v-if="isPasswordTooShort" class="text-red-600 top-0 right-0 absolute">
          Password is too short. minimum 3
        </div>
      </div>

      <!-- Confirm password -->
      <div class="relative">
        <label for="confirmPassword" class="block font-medium text-white">Confirm password:</label>
        <input
          id="confirmPassword"
          v-model="confirmPW"
          type="password"
          class="mt-1 block w-full p-2 border !border-gray-300 rounded-md shadow-sm"
        />
        <div v-if="!passwordsMatch" class="text-red-600 top-0 right-0 absolute">
          Passwords do not match.
        </div>
      </div>

      <!-- Color picker -->
      <div>
        <label for="colorpicker" class="block font-medium text-white">User color:</label>
        <v-color-picker id="colorpicker" hide-inputs v-model="user.color"></v-color-picker>
      </div>

      <!-- Update Button -->
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Settings
      </button>
    </form>

    <!-- Delete Account Button -->
    <button
      @click="confirmDelete"
      class="mt-4 w-full bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
    >
      Delete Account
    </button>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="mt-4 p-4 border border-gray-300 rounded bg-white">
      <p class="text-gray-800">Are you sure you want to delete your account?</p>
      <div class="flex justify-between mt-4">
        <button
          @click="deleteAccount"
          class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
        >
          Yes, Delete It
        </button>
        <button
          @click="showDeleteConfirm = false"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
