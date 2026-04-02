import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, postRequest, putRequest, deleteRequest } from './axios.service'

async function getAllSessionsFromLocalSource() {
  return LocalSource.getAllSessions()
}

async function getSessionsByActivityIdFromLocalSource(activityId) {
  return LocalSource.getSessionsByActivityId(activityId)
}

async function removeSessionFromLocalSource() {
  return { error: 0, status: 200, data: 'done' }
}

async function addSessionToLocalSource(
  activityId,
  beginningDate,
  beginingHour,
  duration,
  nbPlace,
  existingSessions = [],
) {
  let lastId = 0
  if (existingSessions && existingSessions.length > 0) {
    existingSessions.forEach((s) => {
      lastId = Math.max(lastId, s.id)
    })
  }
  return {
    error: 0,
    status: 200,
    data: {
      id: lastId + 1,
      activitiesId: activityId,
      beginingDate: beginningDate,
      beginingHour: beginingHour,
      duration: duration,
      nbPlace: nbPlace,
      registersUsers: [],
    },
  }
}

async function updateSessionFromLocalSource(sessionId, updatedData) {
  return {
    error: 0,
    status: 200,
    data: { id: sessionId, ...updatedData },
  }
}

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
