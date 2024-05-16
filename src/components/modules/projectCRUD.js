const baseURL = import.meta.env.VITE_API_URL;

export const loadStatesFromProjectID = async (projectID) => {
  try {
    const project = await fetch(baseURL + 'projects/getSpecificProject/' + projectID)
    return project.json()
  } catch (error) {
    alert('Cannot load project boards')
  }
}

export const updateSingleProjectBoard = async (boardData) => {
  try {
    await fetch(baseURL + 'projects/updateSingleProjectBoard', {
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

export const getProjectData = async (projectID) => {
  try {
    console.log(projectID)

    const projectData = await fetch(baseURL + 'projects/getSingleProject', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ projectID: projectID }) // body data type must match "Content-Type" header)
    }).catch((err) => {
      alert(err.message)
    })

    return projectData.json()
  } catch (error) {
    console.log(error.message)
  }
}

export const updateProjectData = async (projectData) => {
  try {
    await fetch(baseURL + 'projects/updateProjectData', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(projectData) // body data type must match "Content-Type" header)
    }).catch((err) => {
      alert(err.message)
    })
  } catch (error) {
    console.log(error.message)
  }
}

export const deleteProject = async (projectID) => {
  try {
    await fetch(baseURL + 'projects/deleteProject', {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ projectID: projectID }) // body data type must match "Content-Type" header)
    }).catch((err) => {
      console.error(err.message)
    })
  } catch (error) {
    console.log(error.message)
  }
}

export const updateStatePositions = async (allStates) => {
  const states = allStates.map(state => {
    return {
      position: state.position,
      ID: state.stateID
    };
  });
  try {
    await fetch(baseURL + 'projects/updateStatesPos', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(states)
    });
  } catch (err) {
    console.error(err.message);
  }
}