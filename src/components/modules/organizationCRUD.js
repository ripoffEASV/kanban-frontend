import * as GLOBAL from '../Globals/GLOBALS'

export const addNewOrganization = async (orgName, inviteArr) => {

  await fetch(GLOBAL.URL + 'organizations/addNewOrganization', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      orgName: orgName,
      createdByID: '',
      ownerID: '',
      orgMembers: [],
      projectIDs: [],
      inviteArray: inviteArr
    })
  })
    .then((res) => res.json())
    .then((data) => {
      return { message: 'Organization added successfully', data: data }
    })
    .catch((err) => {
      return { message: 'something went wrong when adding a new organization', error: err.message }
    })
}

export const getOrgs = async () => {
  try {
    const response = await fetch(GLOBAL.URL + 'organizations/getOrganizationsFromID', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`)
    }

    const data = await response.json()
    return { message: 'found orgs', data: data }
  } catch (error) {
    console.error('error: ', error)
    return { message: 'there was an error', error: error }
    // Handle errors, show an alert, or perform other actions as needed.
  }
}

export const getSpecificOrg = async (orgID) => {
  try {

    const response = await fetch(GLOBAL.URL + 'organizations/getSpecificOrg/' + orgID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`)
    }

    const data = await response.json()
    return data.org[0]
  } catch (error) {
    //   console.error('error: ', error)

    return error
    // Handle errors, show an alert, or perform other actions as needed.
  }
}

export const addNewProject = async (ProjectName, projectBoards, projectMembers, orgID) => {
  try {
    const projectData = {
      projectName: ProjectName,
      projectBoards: projectBoards,
      projectMembers: projectMembers,
      orgID: orgID
    }

    console.log(projectData)

    await fetch(GLOBAL.URL + 'projects/addNewProject', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(projectData) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('request completed!: ', data)
      })
      .catch((err) => {
        alert(err.message)
      })

    //console.log(data)
  } catch (error) {
    console.log(error)
  }
}

export const loadProjects = async (orgID) => {
  try {
    const projects = await fetch(GLOBAL.URL + 'projects/getProjects/' + orgID)
    return await projects.json()
  } catch (error) {
    console.log(error)
  }
}

export const updateOrganization = async (organization) => {
  try {
    const response = await fetch(GLOBAL.URL + 'organizations/updateOrganization/' + organization.orgID, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(organization)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`)
    }

    console.log(response);

    const data = await response.json()
    return { message: 'found orgs', data: data }
  } catch (err) {
    console.log(err);
  }
}
