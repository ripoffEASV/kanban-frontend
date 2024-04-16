import * as GLOBAL from '../Globals/GLOBALS'

export const loadStatesFromProjectID = async (projectID) => {
  try {
    const project = await fetch(GLOBAL.URL + 'projects/getSpecificProject/' + projectID)
    return project.json()
  } catch (error) {
    alert('Cannot load project boards')
  }
}
