import { ref } from 'vue'
import { defineStore } from 'pinia'
import registrationService from '@/services/registration.service'

export const useRegistrationStore = defineStore('registration', () => {
  // STATE
  const registrations = ref([])

  // ACTIONS
  async function getAllRegistrations() {
    let response = await registrationService.getAllRegistrations()
    if (response.error === 0) registrations.value = response.data
    else console.log(response.data)
  }

  async function getByActivity(activityId) {
    let response = await registrationService.getRegistrationsByActivity(activityId)
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

  async function addRegistration(activityId, sessionId, userId) {
    let response = await registrationService.addRegistration(activityId, sessionId, userId)
    if (response.error === 0) {
      // Ajouter à l'état local
      if (!registrations.value) {
        registrations.value = []
      }
      registrations.value.push(response.data)
      return response.data
    } else {
      console.log(response.data)
      return null
    }
  }

  return {
    getAllRegistrations,
    getByActivity,
    getByUser,
    addRegistration,
    registrations,
  }
})
