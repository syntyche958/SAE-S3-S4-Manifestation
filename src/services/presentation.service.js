import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'

async function getPresentationContentFromLocalSource() {
  return LocalSource.getPresentationContent()
}

async function getPresentationContent() {
  let response = null
  try {
    response = await getPresentationContentFromLocalSource()
  } catch {
    return networkErrResponse
  }
  return response
}

export default { getPresentationContent }
