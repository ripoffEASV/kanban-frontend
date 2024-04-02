import * as GLOBAL from '../Globals/GLOBALS'

export default function userCrud() {

  const loginUser = async (email, password) => {
    try {
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
        })
        .catch((err) => {
          alert(err.message)
        })
    } catch (error) {
      console.error(error.message)
    }
  }

  const signUpUser = async (name, email, password) => {
    try {
      const user = {
        name: name,
        email: email,
        password: password
      }
  
      await fetch(GLOBAL.URL + 'users/addUser', {
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
