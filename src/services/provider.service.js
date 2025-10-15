import LocalSource from '@/services/localsource.service.js'

var networkErrResponse = { error: 1, status: 400, data: 'A network error occured : ' }

async function getAllProvidersFromLocalSource() {
  return LocalSource.getAllProviders()
}

async function getProviderImagesFromLocalSource(id) {
  return LocalSource.getProviderImages(id)
}

async function getAllProviders() {
  let response = null
  try {
    response = await getAllProvidersFromLocalSource()
  } catch {
    return networkErrResponse
  }

  return response
}

async function getProviderImages(id) {
  let response = null
  try {
    response = await getProviderImagesFromLocalSource(id)
  } catch {
    return networkErrResponse
  }

  return response
}

export default { getAllProviders, getProviderImages }
