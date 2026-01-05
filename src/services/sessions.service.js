import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllSessionsFromLocalSource() {
  return LocalSource.getAllSessions()
}

async function getSessionsByActivityIdFromLocalSource(activityId) {
  return LocalSource.getSessionsByActivityId(activityId)
}

async function removeSessionFromLocalSource() {
  return { error: 0, status: 200, data: 'done' }
}

async function addSessionToLocalSource(activityId, beginningDate, beginingHour, duration, nbPlace, existingSessions = []) {
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
      beginningDate: beginningDate,
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
  let response = null
  try {
    response = await getAllSessionsFromLocalSource()
  } catch {
    return networkErrResponse
  }
  return response
}

async function getSessionsByActivityId(activityId) {
  let response = null
  try {
    response = await getSessionsByActivityIdFromLocalSource(activityId)
  } catch {
    return networkErrResponse
  }
  return response
}

async function removeSession(sessionID) {
  let response = null
  try {
    response = await removeSessionFromLocalSource(sessionID)
  }
  catch {
    return networkErrResponse
  }
  return response
}

async function addSession(activityId, beginningDate, beginingHour, duration, nbPlace, existingSessions = []) {
  let response = null
  try {
    response = await addSessionToLocalSource(activityId, beginningDate, beginingHour, duration, nbPlace, existingSessions)
  }
  catch {
    return networkErrResponse
  }
  return response
}

async function updateSession(sessionId, updatedData) {
  let response = null
  try {
    response = await updateSessionFromLocalSource(sessionId, updatedData)
  } catch {
    return networkErrResponse
  }
  return response
}

export default {
  getAllSessions,
  getSessionsByActivityId,
  removeSession,
  addSession,
  updateSession,
}
