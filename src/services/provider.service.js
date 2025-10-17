import LocalSource from '@/services/localsource.service.js'
import { useProviderStore } from '@/stores/providers'

// TODO : Refactor
var networkErrResponse = { error: 1, status: 400, data: 'A network error occured' }

async function getAllProvidersFromLocalSource() {
  return LocalSource.getAllProviders()
}

async function getProviderImagesFromLocalSource(id) {
  return LocalSource.getProviderImages(id)
}

async function getAllNewProvidersFromLocalSource() {
  return LocalSource.getAllNewProviders()
}

async function removeNewProviderFromLocalSource(id) {
  const providerStore = useProviderStore()
  providerStore.newProviders = providerStore.newProviders.filter((p) => p.id != id)
  return { error: 0, status: 200, data: 'done' }
}

async function addNewProvidersToLocalSource(providerName) {
  const providerStore = useProviderStore()
  let lastId = 0
  providerStore.newProviders.forEach((p) => {
    lastId = Math.max(lastId, p.id)
  })
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

async function addNewProvider(providerName) {
  let response = null
  try {
    response = await addNewProvidersToLocalSource(providerName)
  } catch {
    return networkErrResponse
  }

  return response
}

async function removeNewProvider(id) {
  let response = null
  try {
    response = await removeNewProviderFromLocalSource(id)
  } catch {
    return networkErrResponse
  }

  return response
}

export default {
  getAllProviders,
  getAllNewProviders,
  getProviderImages,
  addNewProvider,
  removeNewProvider,
}
