import { ref } from 'vue'
import { defineStore } from 'pinia'
import SessionsService from '@/services/sessions.service'


export const useSessionStore = defineStore('session', () => {
  const sessions = ref([])

  async function getAllSessions() {
    let response = await SessionsService.getAllSessions()
    if (response.error === 0) {
      sessions.value = response.data
    }
    else {
      console.log(response.data)
    }}

  async function getSessionsByActivityId(activityId) {
    let response = await SessionsService.getSessionsByActivityId(activityId)
    if (response.error === 0) {
      return response.data
    } else {
      console.log(response.data)
      return []
    }}

  return {
    sessions,
    getAllSessions,
    getSessionsByActivityId,
  }
})
