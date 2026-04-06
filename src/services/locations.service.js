import { networkErrResponse } from '@/utils/network.utils'
import { getRequest } from './axios.service'

async function getAllLocations() {
  let response = null
  try {
    response = await getRequest('/locations')
  } catch {
    return networkErrResponse
  }

  return response
}

export default { getAllLocations }
