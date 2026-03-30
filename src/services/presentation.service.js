//import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'
import {getRequest} from './axios.service'

/*async function getPresentationContentFromLocalSource() {
  return LocalSource.getPresentationContent()
}
  */

async function getPresentationContent() {
  let response = null
  try {
    //response = await getPresentationContentFromLocalSource()
    response = await getRequest('/presentation')
  } catch {
    return networkErrResponse
  }
  return response
}

export default { getPresentationContent }
