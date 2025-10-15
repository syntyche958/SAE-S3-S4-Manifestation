import LocalSource from '@/services/localsource.service.js'

var networkErrResponse = { error: 1, status: 400, data: 'A network error occured : ' }

async function getAllProvidersFromLocalSource() {
  return LocalSource.getAllProviders()
}

async function getProviderImagesFromLocalSource(id) {
  return LocalSource.getProviderImages(id)
}

async function getAllNewProvidersFromLocalSource() {
  return LocalSource.getAllNewProviders()
}

async function addNewProvidersToLocalSource(providerName) {
  let lastId = 0
  let providers = LocalSource.getAllProviders()
  for (let provider of providers.data) {
    if (provider.id > lastId) lastId = provider.id
  }
  return { error: 0, status: 200, data: { id: lastId + 1, name: providerName } }
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

async function getAllNewProviders() {
  let response = null
  try {
    response = await getAllNewProvidersFromLocalSource()
  } catch (e) {
    console.log('in')
    return networkErrResponse + e
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

async function addNewProvider(providerName) {
  let response = null
  try {
    response = await addNewProvidersToLocalSource(providerName)
  } catch {
    console.log('in it')
    return networkErrResponse
  }

  return response
}

export default { getAllProviders, getAllNewProviders, getProviderImages, addNewProvider }
