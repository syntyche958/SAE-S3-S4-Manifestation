import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, postRequest, deleteRequest } from './axios.service'

async function getRegistrationsBySession(sessionId) {
  try {
    return await getRequest('/registrations/session/' + sessionId)
  } catch {
    return networkErrResponse
  }
}

async function getRegistrationsByUser(userId) {
  try {
    return await getRequest('/registrations/user/' + userId)
  } catch {
    return networkErrResponse
  }
}

async function addRegistration(sessionId, userId) {
  try {
    return await postRequest('/registrations', { sessionId, userId })
  } catch {
    return networkErrResponse
  }
}

async function deleteRegistration(sessionId, userId) {
  try {
    return await deleteRequest('/registrations', { sessionId, userId })
  } catch {
    return networkErrResponse
  }
}

export default {
  getRegistrationsBySession,
  getRegistrationsByUser,
  addRegistration,
  deleteRegistration,
}
