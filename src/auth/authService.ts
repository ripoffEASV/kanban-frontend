// src/services/authService.js
export default function authService() {
  const getToken = () => localStorage.getItem('userID')

  const setToken = (id: string) => {
    localStorage.setItem('userID', id)
  }

  const isLoggedIn = () => {
    return Boolean(getToken())
  }

  return { isLoggedIn, setToken, getToken }
}
