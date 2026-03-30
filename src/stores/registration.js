import { ref } from 'vue'
import { defineStore } from 'pinia'
import registrationService from '@/services/registration.service'

export const useRegistrationStore = defineStore('registration', () => {
  const registrations = ref([])

  async function getBySession(sessionId) {
    let response = await registrationService.getRegistrationsBySession(sessionId)
    if (response.error === 0) return response.data
    else {
      console.log(response.data)
      return []
    }
  }

  async function getByUser(userId) {
    let response = await registrationService.getRegistrationsByUser(userId)
    if (response.error === 0) return response.data
    else {
      console.log(response.data)
      return []
    }
  }

  async function addRegistration(sessionId, userId) {
    let response = await registrationService.addRegistration(sessionId, userId)
    if (response.error === 0) {
      return response.data
    } else {
      console.log(response.data)
      return null
    }
  }

  async function deleteRegistration(sessionId, userId) {
    let response = await registrationService.deleteRegistration(sessionId, userId)
    if (response.error === 0) {
      return response.data
    } else {
      console.log(response.data)
      return null
    }
  }

  return {
    registrations,
    getBySession,
    getByUser,
    addRegistration,
    deleteRegistration,
  }
})
