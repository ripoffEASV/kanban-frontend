// src/services/authService.js
export default function authService() {
  const getToken = () => localStorage.getItem('auth-token')

  const setToken = (token: string) => {
    localStorage.setItem('auth-token', token)
  }

  const isLoggedIn = () => {
    return Boolean(getToken())
  }

  return { isLoggedIn, setToken, getToken }
}
