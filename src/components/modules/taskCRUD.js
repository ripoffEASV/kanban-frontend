import * as GLOBAL from '../Globals/GLOBALS'

export const updateSingleTask = async (taskData) => {
  try {
    await fetch(GLOBAL.URL + 'tasks/updateSingleTask', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(taskData) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Done')
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.log(error.message)
  }
}

export const deleteSingleTask = async (taskID) => {
  try {
    await fetch(GLOBAL.URL + 'tasks/deleteSingleTask', {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ taskID: taskID }) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log('Task Deleted')
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.log(error.message)
  }
}

export const updateTaskPosition = async (taskList) => {
  try {
    await fetch(GLOBAL.URL + 'tasks/updateTaskPosition', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(taskList) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log('Task Deleted')
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.log(error.message)
  }
}

export const updateTaskState = async (taskID, newStateID) => {
  try {
    await fetch(GLOBAL.URL + 'tasks/updateTaskState', {
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
        //console.log('Task Deleted')
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.log(error.message)
  }
}
