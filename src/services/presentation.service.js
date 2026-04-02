import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, putRequest } from './axios.service'

async function getPresentationContent() {
  let response = null
  try {
    response = await getRequest('/presentation')
  } catch {
    return networkErrResponse
  }
  return response
}

async function updatePresentation(patch) {
  try {
    return await putRequest('/presentation', patch)
  } catch {
    return networkErrResponse
  }
}

export default { getPresentationContent, updatePresentation }
