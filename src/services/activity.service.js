import { networkErrResponse } from '@/utils/network.utils'
import { getRequest, patchRequest, postRequest, putRequest } from './axios.service'

async function getAllActivities() {
  let response = null
  try {
    response = await getRequest('/activities')
  } catch {
    return networkErrResponse
  }

  return response
}

function pickActivityUpdatePayload(activity, overrides = {}) {
  const rawPid = activity.providerId
  return {
    id: Number(activity.id),
    providerId: rawPid != null ? Number(rawPid) : rawPid,
    name: activity.name,
    description: activity.description || '',
    locationId: overrides.locationId ?? activity.locationId,
    requestedLocationId: overrides.requestedLocationId ?? activity.requestedLocationId,
    spotIds: overrides.spotIds ?? activity.spotIds ?? [],
    requestedSpotIds: overrides.requestedSpotIds ?? activity.requestedSpotIds ?? [],
    visibility: overrides.visibility ?? activity.visibility ?? 'public',
    commentsEnabled: overrides.commentsEnabled ?? activity.commentsEnabled ?? true,
    sessionsEnabled: overrides.sessionsEnabled ?? activity.sessionsEnabled ?? true,
    registrationCountEnabled:
      overrides.registrationCountEnabled ?? activity.registrationCountEnabled ?? true,
    canRegister: overrides.canRegister ?? activity.canRegister,
    presentationContent:
      overrides.presentationContent ?? activity.presentationContent ?? '',
    ratings: overrides.ratings ?? activity.ratings ?? [],
    comments: overrides.comments ?? activity.comments ?? [],
  }
}

async function updateActivity(activity, overrides = {}) {
  try {
    return await putRequest('/activities', pickActivityUpdatePayload(activity, overrides))
  } catch {
    return networkErrResponse
  }
}

async function updateLocationId(activity, locationId) {
  return updateActivity(activity, { locationId })
}

async function addRequestedSpots(activity, locationId, dateHours) {
  const existingSpots = activity.spotIds || []
  const existingRequests = activity.requestedSpotIds || []

  const spotKeys = new Set(existingSpots.map((s) => `${s.locationId}-${s.dateHour}`))
  const requestKeys = new Set(existingRequests.map((s) => `${s.locationId}-${s.dateHour}`))

  const unique = [...new Set((dateHours || []).map(String))]
  const newRequests = []
  for (const dateHour of unique) {
    const key = `${locationId}-${dateHour}`
    if (spotKeys.has(key) || requestKeys.has(key)) continue
    requestKeys.add(key)
    newRequests.push({ locationId, dateHour })
  }

  if (newRequests.length === 0) {
    return { error: 0, status: 200, data: activity }
  }

  return updateActivity(activity, {
    requestedSpotIds: [...existingRequests, ...newRequests],
    requestedLocationId: locationId,
  })
}

/** Retire uniquement les créneaux demandés indiqués pour cet emplacement. */
async function removeRequestedSpots(activity, locationId, dateHours) {
  const unique = [...new Set((dateHours || []).map(String))]
  if (unique.length === 0) {
    return { error: 0, status: 200, data: activity }
  }

  const removeKeys = new Set(unique.map((dh) => `${String(locationId)}-${dh}`))
  const existing = activity.requestedSpotIds || []
  const updated = existing.filter(
    (r) => !removeKeys.has(`${String(r.locationId)}-${String(r.dateHour)}`),
  )

  let requestedLocationId = activity.requestedLocationId
  if (updated.length === 0) {
    requestedLocationId = undefined
  } else {
    const prevLoc = activity.requestedLocationId
    const stillOnPrev = updated.some((r) => String(r.locationId) === String(prevLoc))
    requestedLocationId = stillOnPrev ? prevLoc : updated[0].locationId
  }

  return updateActivity(activity, {
    requestedSpotIds: updated,
    requestedLocationId,
  })
}

async function addToLocalSource(providerId, name, desc, locale = 'fr') {
  try {
    return await postRequest('/activities', { providerId, name, description: desc, locale })
  } catch {
    return networkErrResponse
  }
}

async function addSpotsBulk(activity, locationId, dateHours) {
  const unique = [...new Set((dateHours || []).map(String))]
  let updatedSpots = [...(activity.spotIds || [])]
  let updatedRequests = [...(activity.requestedSpotIds || [])]

  for (const dateHour of unique) {
    if (
      updatedSpots.some(
        (s) => String(s.locationId) === String(locationId) && String(s.dateHour) === dateHour,
      )
    ) {
      continue
    }
    updatedSpots.push({ locationId, dateHour })
    updatedRequests = updatedRequests.filter(
      (r) => !(String(r.locationId) === String(locationId) && String(r.dateHour) === dateHour),
    )
  }

  return updateActivity(activity, {
    locationId,
    spotIds: updatedSpots,
    requestedSpotIds: updatedRequests,
  })
}

async function addActivityRating(activityId, userId, note) {
  try {
    return await postRequest(`/activities/${activityId}/ratings`, { userId, note })
  } catch {
    return networkErrResponse
  }
}

async function addActivityComment(activityId, userId, title, content) {
  try {
    return await postRequest(`/activities/${activityId}/comments`, { userId, title, content })
  } catch {
    return networkErrResponse
  }
}

async function replyToActivityComment(activityId, commentIndex, replyContent) {
  try {
    return await patchRequest(`/activities/${activityId}/comments/${commentIndex}/reply`, {
      replyContent,
    })
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllActivities,
  updateActivity,
  updateLocationId,
  addRequestedSpots,
  removeRequestedSpots,
  addSpotsBulk,
  addToLocalSource,
  addActivityRating,
  addActivityComment,
  replyToActivityComment,
}
