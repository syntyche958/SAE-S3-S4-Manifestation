import LocalSource from '@/services/localsource.service.js'
import { useActivityStore } from '@/stores/activities'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllActivitiesFromLocalSource() {
  return LocalSource.getAllActivities()
}

async function getAllActivities() {
  let response = null
  try {
    response = await getAllActivitiesFromLocalSource()
  } catch {
    return networkErrResponse
  }

  return response
}

async function updateLocationIdLocalSource(activityId, locationId) {
  const activityStore = useActivityStore()
  return {
    error: 0,
    status: 200,
    data: activityStore.activities.map((a) => (a.id != activityId ? a : { ...a, locationId })),
  }
}

async function updateRequestedLocationIdLocalSource(activityId, requestedLocationId) {
  const activityStore = useActivityStore()
  return {
    error: 0,
    status: 200,
    data: activityStore.activities.value.map((a) =>
      a.id === activityId ? { ...a, requestedLocationId: requestedLocationId } : a,
    ),
  }
}

export default {
  getAllActivities,
  updateLocationIdLocalSource,
  updateRequestedLocationIdLocalSource,
}
