import * as GLOBAL from '../Globals/GLOBALS'
import { ref } from 'vue'

export default function userCrud() {

  const loginUser = async (emailOrUsername, password) => {
    try {
      const loggedIn = ref(false);
      const data = {
        emailOrUsername,
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
          loggedIn.value = true

          localStorage.setItem('auth-token', '')
          localStorage.setItem('auth-token', token.data);
          return loggedIn.value;
        })
        .catch((err) => {
          alert(err)
          return loggedIn.value;
        })
    } catch (error) {
      console.error(error)
    }
  }

  const signUpUser = async (fname, lname, username, email, password) => {
    try {
      const user = {
        fName: fname,
        lName: lname,
        username,
        email,
        password
      }
  
      await fetch(GLOBAL.URL + 'users/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    } catch (err) {
      console.error(err.message);
    }
  }

  return { loginUser, signUpUser }
}
