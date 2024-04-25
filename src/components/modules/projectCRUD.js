import * as GLOBAL from '../Globals/GLOBALS'

export const loadStatesFromProjectID = async (projectID) => {
  try {
    const project = await fetch(GLOBAL.URL + 'projects/getSpecificProject/' + projectID)
    return project.json()
  } catch (error) {
    alert('Cannot load project boards')
  }
}

export const updateSingleProjectBoard = async (boardData) => {
  try {
    await fetch(GLOBAL.URL + 'projects/updateSingleProjectBoard', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(boardData) // body data type must match "Content-Type" header)
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
