import LocalSource from '@/services/localsource.service.js'
import { useProviderStore } from '@/stores/providers'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllProvidersFromLocalSource() {
  return LocalSource.getAllProviders()
}

async function getProviderImagesFromLocalSource(id) {
  return LocalSource.getProviderImages(id)
}

async function getAllNewProvidersFromLocalSource() {
  return LocalSource.getAllNewProviders()
}

async function getProvidersDescriptionFromLocalSource(id) {
  return LocalSource.getProviderDescription(id)
}

async function removeNewProviderFromLocalSource(id) {
  const providerStore = useProviderStore()
  providerStore.newProviders = providerStore.newProviders.filter((p) => p.id != id)
  return { error: 0, status: 200, data: 'done' }
}

async function updateProviderDescriptionFromLocalSource(providerId, providerDesc) {
  return LocalSource.updateProviderDescription(providerId, providerDesc)
}

async function uploadProviderImageFromLocalSource(providerId, imageData) {
  return LocalSource.uploadProviderImage(providerId, imageData)
}

async function deleteProviderImageFromLocalSource(providerId, imageId) {
  return LocalSource.deleteProviderImage(providerId, imageId)
}

async function addNewProvidersToLocalSource(providerName, providerDesc) {
  const providerStore = useProviderStore()
  let lastId = 0
  providerStore.newProviders.forEach((p) => {
    lastId = Math.max(lastId, p.id)
  })
  return {
    error: 0,
    status: 200,
    data: { id: lastId + 1, name: providerName, description: providerDesc },
  }
}

async function validateNewProvidersFromLocalSource(data) {
  const providerStore = useProviderStore()
  // Return new provider
  let lastId = 0
  providerStore.providers.forEach((p) => {
    lastId = Math.max(lastId, p.id)
  })
  data.id = lastId + 1
  return { error: 0, status: 200, data }
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

async function addNewProvider(providerName, providerDesc) {
  let response = null
  try {
    response = await addNewProvidersToLocalSource(providerName, providerDesc)
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

async function validateNewProviders(data) {
  let response = null
  try {
    response = await validateNewProvidersFromLocalSource(data)
  } catch {
    return networkErrResponse
  }

  return response
}

async function getProviderDescription(id) {
  let response = null
  try {
    response = await getProvidersDescriptionFromLocalSource(id)
  } catch {
    return networkErrResponse
  }
  return response
}

async function updateProviderDescription(providerId, newDescription) {
  let response = null
  try {
    response = await updateProviderDescriptionFromLocalSource(providerId, newDescription)
  } catch {
    return networkErrResponse
  }
  return response
}

async function uploadProviderImage(providerId, imageData) {
  let response = null
  try {
    response = await uploadProviderImageFromLocalSource(providerId, imageData)
  } catch {
    return networkErrResponse
  }
  return response
}

async function deleteProviderImage(providerId, imageId) {
  let response = null
  try {
    response = await deleteProviderImageFromLocalSource(providerId, imageId)
  } catch {
    return networkErrResponse
  }
  return response
}

export default {
  getAllProviders,
  getAllNewProviders,
  getProviderImages,
  updateProviderDescription,
  addNewProvider,
  removeNewProvider,
  validateNewProviders,
  getProviderDescription,
  uploadProviderImage,
  deleteProviderImage,
}
