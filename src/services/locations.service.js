import LocalSource from '@/services/localsource.service.js'

async function getAllLocationsFromLocalSource() {
  return LocalSource.getAllLocations()
}

async function getAllLocations() {
  let response = null
  try {
    response = await getAllLocationsFromLocalSource()
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }

  return response
}

export default { getAllLocations }
