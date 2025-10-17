import LocalSource from '@/services/localsource.service.js'

var networkErrResponse = { error: 1, status: 400, data: 'A network error occured' }

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
