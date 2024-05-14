// src/services/authService.js
export default function authService() {
  const getUserID = () => localStorage.getItem('userID')

  const setUserID = (id: string) => {
    localStorage.setItem('userID', id)
  }

  const isLoggedIn = () => {
    return Boolean(getUserID())
  }

  return { isLoggedIn, setUserID, getUserID }
}
