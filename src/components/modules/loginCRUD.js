const baseURL = import.meta.env.VITE_API_URL;
import { useAuthStore } from '../../stores/authStore';

export default function userCrud() {
  const authStore = useAuthStore();

  const loginUser = async (emailOrUsername, password) => {
    try {
      const data = {
        emailOrUsername,
        password: password
      }

      const response = await fetch(baseURL + 'users/login', {
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
        if (result && result.data && result.data.id) {
          authStore.login(result.data);
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
  
      const response = await fetch(baseURL + 'users/register', {
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

  const logout = async () => {
    try {
      const response = await fetch(baseURL + 'users/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        authStore.logout();
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out');
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  const getUserDetails = async () => {
    try {
      const response = await fetch(baseURL + 'users/find-user', {
        method: 'GET',
        credentials: 'include'
      });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        const res = await response.json();
        return res;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      authStore.logout();
    }
  }

  const updateUser = async (user) => {
    try {
      const response = await fetch(baseURL + 'users/update-user', {
        method: 'POST',
        credentials: 'include',
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
    } catch(err) {
      console.error('Error failed to edit user:', err);
    }
  }

  const deleteUser = async () => {
    try {
      const response = await fetch(baseURL + 'users/delete', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('Error failed to delete user', err);
      return false;
    }
  }

  return { loginUser, signUpUser, logout, getUserDetails, updateUser, deleteUser }
}
