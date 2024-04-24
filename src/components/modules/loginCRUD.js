import * as GLOBAL from '../Globals/GLOBALS'
import { useAuthStore } from '../../stores/authStore';
const authStore = useAuthStore();

export default function userCrud() {

  const loginUser = async (emailOrUsername, password) => {
    try {
      const data = {
        emailOrUsername,
        password: password
      }

      const response = await fetch(GLOBAL.URL + 'users/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

        if (!response.ok) {
          throw new Error('Login failed!');
        }

        const result = await response.json();
        if (result && result.data && result.data.userID) {
          authStore.login(result.data.userID);
          return true;
        } else {
          return false;
        }

    } catch (error) {
      console.error(error)
      return false;
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
  
      const response = await fetch(GLOBAL.URL + 'users/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }

  return { loginUser, signUpUser }
}
