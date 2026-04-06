import { networkErrResponse } from '@/utils/network.utils'
import { deleteRequest, getRequest, postRequest, putRequest } from './axios.service'

async function getAllProviders() {
  let response = null
  try {
    response = await getRequest('/providers')
  } catch {
    return networkErrResponse
  }

  return response
}

async function getAllNewProviders() {
  let response = null
  try {
    response = await getRequest('/providers/new')
  } catch {
    return networkErrResponse
  }

  return response
}

async function getProviderImages(id) {
  let response = null
  try {
    response = await getRequest(`/providers/${id}/images`)
  } catch {
    return networkErrResponse
  }
  return response
}

async function addNewProvider(providerName, providerDesc) {
  let response = null
  try {
    response = await postRequest('/providers/new', { name: providerName, description: providerDesc })
  } catch {
    return networkErrResponse
  }

  return response
}

async function removeNewProvider(id) {
  let response = null
  try {
    response = await deleteRequest('/providers/new', { id })
  } catch {
    return networkErrResponse
  }

  return response
}

async function validateNewProviders(data) {
  let response = null
  try {
    response = await postRequest(`/providers/accept-new-provider/${data.id}`)
  } catch {
    return networkErrResponse
  }

  return response
}

async function updateProviderDescription(payload) {
  let response = null
  try {
    response = await putRequest('/providers', payload)
  } catch {
    return networkErrResponse
  }
  return response
}

async function uploadProviderImage(providerId, imageData) {
  let response = null
  try {
    response = await postRequest(`/providers/${providerId}/images`, imageData)
  } catch {
    return networkErrResponse
  }
  return response
}

async function deleteProviderImage(providerId, imageId) {
  let response = null
  try {
    response = await deleteRequest(`/providers/images/${imageId}`)
  } catch {
    return networkErrResponse
  }
  return response
}

async function updateProviderImage(imageId, imageData) {
  let response = null
  try {
    response = await putRequest(`/providers/images/${imageId}`, imageData)
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
  uploadProviderImage,
  deleteProviderImage,
  updateProviderImage,
}
