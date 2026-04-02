import { deleteRequest, getRequest, postRequest } from './axios.service'
import { networkErrResponse } from '@/utils/network.utils'

async function getForUser(userId) {
  try {
    return await getRequest(`/notifications/user/${userId}`)
  } catch {
    return networkErrResponse
  }
}

async function notifyUsers(userIds, message) {
  try {
    return await postRequest('/notifications', { userIds, message })
  } catch {
    return networkErrResponse
  }
}

async function clearForUser(userId) {
  try {
    return await deleteRequest(`/notifications/user/${userId}`)
  } catch {
    return networkErrResponse
  }
}

export default {
  getForUser,
  notifyUsers,
  clearForUser,
}
