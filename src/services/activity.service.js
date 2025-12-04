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
  // Vérifie que cet emplacement a pas déjà été assigné
  let activities = activityStore.activities
  activities = activities.map((a) =>
    a.locationId === locationId ? { ...a, locationId: undefined } : a,
  )
  // Vérifie que cet emplacement est pas dans d'autre demandes
  activities = activities.map((a) =>
    a.requestedLocationId === locationId ? { ...a, requestedLocationId: undefined } : a,
  )

  // assigner l'emplacement
  return {
    error: 0,
    status: 200,
    data: activities.map((a) =>
      a.id != activityId ? a : { ...a, locationId, requestedLocationId: undefined },
    ),
  }
}

async function updateRequestedLocationIdLocalSource(activityId, requestedLocationId) {
  const activityStore = useActivityStore()
  return {
    error: 0,
    status: 200,
    data: activityStore.activities.map((a) =>
      a.id === activityId ? { ...a, requestedLocationId } : a,
    ),
  }
}

export default {
  getAllActivities,
  updateLocationIdLocalSource,
  updateRequestedLocationIdLocalSource,
}
