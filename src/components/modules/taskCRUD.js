const baseURL = import.meta.env.VITE_API_URL;

export const updateSingleTask = async (taskData) => {
  try {
    await fetch(baseURL + 'tasks/updateSingleTask', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(taskData) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error.message)
  }
}

export const deleteSingleTask = async (taskID) => {
  try {
    await fetch(baseURL + 'tasks/deleteSingleTask', {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ taskID: taskID }) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error.message)
  }
}

export const updateTaskPosition = async (taskList) => {
  try {
    await fetch(baseURL + 'tasks/updateTaskPosition', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(taskList) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error.message)
  }
}

export const updateTaskState = async (taskID, newStateID) => {
  try {
    await fetch(baseURL + 'tasks/updateTaskState', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        taskID: taskID,
        newStateID: newStateID
      }) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error.message)
  }
}
