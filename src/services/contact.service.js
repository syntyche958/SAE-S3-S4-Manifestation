import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, postRequest, deleteRequest } from './axios.service'

async function getAllContacts() {
  try {
    return await getRequest('/contacts')
  } catch {
    return networkErrResponse
  }
}

async function getAllContactsById(userId) {
  try {
    return await getRequest('/contacts/' + userId)
  } catch {
    return networkErrResponse
  }
}

async function addContact(mail, providerId, activityId, message) {
  try {
    const body = { mail, providerId, activityId, message }
    return await postRequest('/contacts', body)
  } catch {
    return networkErrResponse
  }
}

async function removeContact(id) {
  try {
    return await deleteRequest('/contacts/' + id)
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllContacts,
  getAllContactsById,
  addContact,
  removeContact,
}
