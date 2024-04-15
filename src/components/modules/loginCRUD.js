import * as GLOBAL from '../Globals/GLOBALS'
import { ref } from 'vue'

export const loginUser = async (email, password) => {
  try {
    const loggedIn = ref(false)
    const data = {
      email: email,
      password: password
    }

    await fetch(GLOBAL.URL + 'users/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {

        let token = data.data

        localStorage.setItem('auth-token', '')
        localStorage.setItem('auth-token', token.data)
        loggedIn.value = true
        console.log(loggedIn.value)
        
       

      })
      .catch((err) => {
        alert(err.message)
        
      })
      return loggedIn.value
  } catch (error) {
    console.error(error.message)
  }
}
