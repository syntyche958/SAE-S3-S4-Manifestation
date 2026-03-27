import { useActivityStore } from '@/stores/activities'
import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, postRequest } from './axios.service'

async function getAllActivities() {
  let response = null
  try {
    response = await getRequest('/activities')
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

async function refuseRequestedLocationIdLocalSource(activityId) {
  const activityStore = useActivityStore()

  return {
    error: 0,
    status: 200,
    data: activityStore.activities.map((a) =>
      a.id === activityId ? { ...a, requestedLocationId: undefined } : a,
    ),
  }
}

async function addToLocalSource(providerId, name, desc) {
  try {
    return await postRequest('/activities', { providerId, name, description: desc })
  } catch {
    return networkErrResponse
  }
}

async function addRatingLocalSource(activityId, userId, note) {
  const activityStore = useActivityStore()
  const activities = activityStore.activities

  let updatedActivities = activities.map((a) => {
    if (a.id === activityId) {
      let existingRatings = a.ratings || []

      const existingRatingIndex = existingRatings.findIndex((r) => r.userId === userId)
      let newRatings = [...existingRatings]
      if (existingRatingIndex !== -1) {
        newRatings[existingRatingIndex] = { userId, note }
      } else {
        newRatings.push({ userId, note })
      }
      return { ...a, ratings: newRatings }
    }
    return a
  })

  return { error: 0, status: 200, data: updatedActivities.find((a) => a.id === activityId) }
}

async function addCommentLocalSource(activityId, userId, title, content) {
  const activityStore = useActivityStore()
  const activities = activityStore.activities

  let updatedActivities = activities.map((a) => {
    if (a.id === activityId) {
      let existingComments = a.comments || []
      existingComments.push({ userId, title, content })
      return { ...a, comments: existingComments }
    }
    return a
  })

  return { error: 0, status: 200, data: updatedActivities.find((a) => a.id === activityId) }
}

async function addSpotLocalSource(activityId, locationId, dateHour) {
  const activityStore = useActivityStore()
  const spot = { locationId, dateHour }
  return {
    error: 0,
    status: 200,
    data: activityStore.activities.map((a) =>
      a.id === activityId ? { ...a, spotIds: [...(a.spotIds || []), spot] } : a,
    ),
  }
}

async function addCommentReplyLocalSource(activityId, commentIndex, replyContent) {
  const activityStore = useActivityStore()
  const activities = activityStore.activities

  let updatedActivities = activities.map((a) => {
    if (a.id === activityId) {
      if (a.comments && a.comments[commentIndex]) {
        a.comments[commentIndex].reply = replyContent
      }
      return { ...a }
    }
    return a
  })

  return { error: 0, status: 200, data: updatedActivities.find((a) => a.id === activityId) }
}

async function updateServiceFlagsLocalSource(activityId, payload) {
  const activityStore = useActivityStore()

  const nextActivities = activityStore.activities.map((a) => {
    if (a.id !== activityId) {
      return a
    }

    return {
      ...a,
      ...(payload.serviceEnabled !== undefined
        ? { serviceEnabled: payload.serviceEnabled }
        : {}),
      ...(payload.visibility !== undefined
        ? { visibility: payload.visibility }
        : {}),
      ...(payload.commentsEnabled !== undefined
        ? { commentsEnabled: payload.commentsEnabled }
        : {}),
      ...(payload.sessionsEnabled !== undefined
        ? { sessionsEnabled: payload.sessionsEnabled }
        : {}),
      ...(payload.registrationCountEnabled !== undefined
        ? { registrationCountEnabled: payload.registrationCountEnabled }
        : {}),
      ...(payload.canRegister !== undefined
        ? { canRegister: payload.canRegister }
        : {}),
    }
  })

  return {
    error: 0,
    status: 200,
    data: nextActivities,
  }
}

export default {
  getAllActivities,
  updateLocationIdLocalSource,
  updateRequestedLocationIdLocalSource,
  refuseRequestedLocationIdLocalSource,
  addSpotLocalSource,
  addToLocalSource,
  addRatingLocalSource,
  addCommentLocalSource,
  addCommentReplyLocalSource,
  updateServiceFlagsLocalSource,
}
