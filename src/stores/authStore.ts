import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../auth/authService'
import router from '../router'
import type { User } from '../interfaces/i_user'
import userCrud from '../components/modules/loginCRUD'

export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(false)
  const loggedInUser = ref<User>()

  const { isLoggedIn, setUserID, getUserID } = authService()
  const { getUserDetails } = userCrud()

  function checkLogin() {
    loggedIn.value = isLoggedIn()
    if (loggedIn.value) {
      fetchUserDetails()
    }
  }

  function login(user: User) {
    setUserID(user.id)
    checkLogin()
    setLoggedInUser(user)
  }

  async function fetchUserDetails() {
    const userID = getUserID()
    if (userID) {
      try {
        const user = await getUserDetails()
        setLoggedInUser(user)
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        logout()
      }
    }
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

  return {
    loggedIn,
    login,
    logout,
    getUserID,
    checkLogin,
    setLoggedInUser,
    getLoggedInUser,
    fetchUserDetails
  }
})
