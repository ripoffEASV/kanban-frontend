import * as GLOBAL from '../Globals/GLOBALS'

export const addNewOrganization = async (orgName, inviteArr) => {
  const bearerToken = 'bearer ' + localStorage.getItem('auth-token')

  await fetch(GLOBAL.URL + 'organizations/addNewOrganization', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'content-type': 'application/json',
      Authorization: bearerToken
    },
    credentials: 'include',
    body: JSON.stringify({
      orgName: orgName,
      createdByID: '',
      ownerID: '',
      orgMembers: [],
      projectIDs: [],
      inviteArray: JSON.stringify(inviteArr)
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
    const token = localStorage.getItem('auth-token')

    const response = await fetch(GLOBAL.URL + 'organizations/getOrganizationsFromID', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
    const token = localStorage.getItem('auth-token')

    const response = await fetch(GLOBAL.URL + 'organizations/getSpecificOrg/' + orgID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
