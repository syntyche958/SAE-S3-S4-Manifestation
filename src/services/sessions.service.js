import LocalSource from '@/services/localsource.service.js'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllSessionsFromLocalSource(){
  return LocalSource.getAllSessions()
}

async function getAllSessions(){
  let response=null
  try {
    response = await getAllSessionsFromLocalSource()
  }catch {
  return networkErrResponse}
  return response

}

export default {
  getAllSessions,
}
