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

export default {
  getAllSessions,
  getSessionsByActivityId,
  removeSession,
}
