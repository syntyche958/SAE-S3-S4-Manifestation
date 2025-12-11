import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'
import { useSessionStore } from '@/stores/sessions'


async function getAllSessionsFromLocalSource(){
  return LocalSource.getAllSessions()
}

async function getSessionsByActivityIdFromLocalSource(activityId) {
  return LocalSource.getSessionsByActivityId(activityId)
}

async function removeSessionFromLocalSource(sessionId){
  const storeSessions=useSessionStore()
  storeSessions.delSession=storeSessions.delSession.filter((ds)=>ds.sessionId != sessionId)
  return { error: 0, status: 200, data: 'done' }
}

async function addSessionToLocalSource(activityId, beginningDate,beginingHour, duration,nbPlace) {
  const sessionStore=useSessionStore()
  let lastId = 0
  sessionStore.sessions.forEach((s) => {
    lastId = Math.max(lastId, s.id)
  })
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
    },
  }
}

async function updateSessionFromLocalSource(sessionId, updatedData) {
  const sessionStore = useSessionStore()

  const sessionIndex = sessionStore.sessions.findIndex((s) => s.id === sessionId)

  // (...) garde toutes les propriétés existantes et écrase uniquement celles présentes dans updatedData -> donné par claude
  sessionStore.sessions[sessionIndex] = {
    ...sessionStore.sessions[sessionIndex],
    ...updatedData,
  }

  return {
    error: 0,
    status: 200,
    data: sessionStore.sessions[sessionIndex],
  }
}


async function getAllSessions(){
  let response=null
  try {
    response = await getAllSessionsFromLocalSource()
  }catch {
  return networkErrResponse}
  return response

}

async function getSessionsByActivityId(activityId) {
  let response=null
  try {
    response= await getSessionsByActivityIdFromLocalSource(activityId)
  }catch {
  return networkErrResponse}
  return response
}

async function removeSession(sessionID){
  let response = null
  try{
    response = await removeSessionFromLocalSource(sessionID)
  }
  catch{
    return networkErrResponse
  }
  return response
}

async function addSession(activityId,beginningDate,beginingHour,duration,nbPlace){
  let response = null
  try{
    response = await addSessionToLocalSource(activityId,beginningDate,beginingHour,duration,nbPlace)
  }
  catch{
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
