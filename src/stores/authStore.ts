import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../auth/authService'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(false)

  const { isLoggedIn, setUserID, getUserID } = authService()

  function checkLogin() {
    loggedIn.value = isLoggedIn()
  }

  function login(userID: string) {
    setUserID(userID)
    checkLogin()
  }

  function logout() {
    localStorage.removeItem('userID')
    checkLogin()
    router.push('/').catch((err) => {
      console.error('Router error:', err)
    })
  }

  return { loggedIn, login, logout, getUserID, checkLogin }
})
