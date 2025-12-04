import { ref } from 'vue'
import { defineStore } from 'pinia'

import activityService from '@/services/activity.service'

export const useActivityStore = defineStore('activity', () => {
  // STATE
  const activities = ref([])

  // ACTIONS
  async function getAllActivities() {
    let response = await activityService.getAllActivities()
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  function get(activityId) {
    return activities.value.find((a) => a.id === activityId)
  }

  async function updateLocationId(activity_id, locationId) {
    let response = await activityService.updateLocationIdLocalSource(activity_id, locationId)
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  async function updateRequestedLocationId(activityId, requestedLocationId) {
    let response = await activityService.updateRequestedLocationIdLocalSource(
      activityId,
      requestedLocationId,
    )
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  return {
    getAllActivities,
    get,
    updateLocationId,
    updateRequestedLocationId,
    activities,
  }
})
