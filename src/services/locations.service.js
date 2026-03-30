//import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'
import { getRequest } from './axios.service'

/*async function getAllLocationsFromLocalSource() {
  return LocalSource.getAllLocations()
}
  */

async function getAllLocations() {
  let response = null
  try {
    //response = await getAllLocationsFromLocalSource()
    response = await getRequest('/locations')
  } catch {
    return networkErrResponse
  }

  return response
}

export default { getAllLocations }
