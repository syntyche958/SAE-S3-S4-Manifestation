import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllSessionsFromLocalSource(){
  return LocalSource.getAllSessions()
}

async function getSessionsByActivityIdFromLocalSource(activityId) {
  return LocalSource.getSessionsByActivityId(activityId)
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

export default {
  getAllSessions,
  getSessionsByActivityId,
}
