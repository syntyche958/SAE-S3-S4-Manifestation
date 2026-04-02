import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, postRequest, putRequest, deleteRequest } from './axios.service'

async function getAllSessions() {
  try {
    return await getRequest('/sessions')
  } catch {
    return networkErrResponse
  }
}

async function getSessionsByActivityId(activityId) {
  try {
    const response = await getRequest('/sessions')
    if (response.error === 0) {
      return { ...response, data: response.data.filter((s) => s.activityId === activityId) }
    }
    return response
  } catch {
    return networkErrResponse
  }
}

async function removeSession(sessionID) {
  try {
    return await deleteRequest('/sessions/' + sessionID)
  } catch {
    return networkErrResponse
  }
}

async function addSession(activityId, beginningDate, beginingHour, duration, nbPlace) {
  try {
    return await postRequest('/sessions', {
      activityId,
      beginingDate: beginningDate,
      beginingHour,
      duration,
      nbPlace,
    })
  } catch {
    return networkErrResponse
  }
}

async function updateSession(sessionId, updatedData) {
  try {
    return await putRequest('/sessions', { id: sessionId, ...updatedData })
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllSessions,
  getSessionsByActivityId,
  removeSession,
  addSession,
  updateSession,
}
