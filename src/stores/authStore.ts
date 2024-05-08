import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../auth/authService'
import router from '../router'
import type { User } from '../interfaces/i_user'

export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(false)
  const loggedInUser = ref<User>()

  const { isLoggedIn, setUserID, getUserID } = authService()

  function checkLogin() {
    loggedIn.value = isLoggedIn()
  }

  function login(user: User) {
    setUserID(user.id)
    checkLogin()
    setLoggedInUser(user)
  }

  function setLoggedInUser(user: User) {
    loggedInUser.value = user
  }

  function getLoggedInUser(): User | undefined {
    return loggedInUser.value
  }

  function logout() {
    localStorage.removeItem('userID')
    checkLogin()
    loggedInUser.value = undefined
    router.push('/').catch((err) => {
      console.error('Router error:', err)
    })
  }

  return { loggedIn, login, logout, getUserID, checkLogin, setLoggedInUser, getLoggedInUser }
})
