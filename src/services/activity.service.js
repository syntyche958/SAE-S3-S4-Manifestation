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
  const rawProviderId = activity.providerId
  const providerId = rawProviderId == null ? rawProviderId : Number(rawProviderId)
  const id = Number(activity.id)

  const locationId = overrides.locationId === undefined ? activity.locationId : overrides.locationId
  const requestedLocationId =
    overrides.requestedLocationId === undefined
      ? activity.requestedLocationId
      : overrides.requestedLocationId

  const spotIds = overrides.spotIds === undefined ? (activity.spotIds ?? []) : overrides.spotIds
  const requestedSpotIds =
    overrides.requestedSpotIds === undefined
      ? (activity.requestedSpotIds ?? [])
      : overrides.requestedSpotIds

  const visibility =
    overrides.visibility === undefined ? (activity.visibility ?? 'public') : overrides.visibility
  const commentsEnabled =
    overrides.commentsEnabled === undefined
      ? (activity.commentsEnabled ?? true)
      : overrides.commentsEnabled
  const sessionsEnabled =
    overrides.sessionsEnabled === undefined
      ? (activity.sessionsEnabled ?? true)
      : overrides.sessionsEnabled
  const registrationCountEnabled =
    overrides.registrationCountEnabled === undefined
      ? (activity.registrationCountEnabled ?? true)
      : overrides.registrationCountEnabled

  const canRegister =
    overrides.canRegister === undefined ? activity.canRegister : overrides.canRegister
  const presentationContent =
    overrides.presentationContent === undefined
      ? (activity.presentationContent ?? '')
      : overrides.presentationContent
  const ratings = overrides.ratings === undefined ? (activity.ratings ?? []) : overrides.ratings
  const comments = overrides.comments === undefined ? (activity.comments ?? []) : overrides.comments

  return {
    id,
    providerId,
    name: activity.name,
    description: activity.description || '',
    locationId,
    requestedLocationId,
    spotIds,
    requestedSpotIds,
    visibility,
    commentsEnabled,
    sessionsEnabled,
    registrationCountEnabled,
    canRegister,
    presentationContent,
    ratings,
    comments,
  }
}

function toUniqueDateHours(dateHours) {
  const unique = []
  for (const dateHour of dateHours || []) {
    const value = String(dateHour)
    if (!unique.includes(value)) {
      unique.push(value)
    }
  }
  return unique
}

function hasSpotForDateHour(spots, locationId, dateHour) {
  return spots.some(
    (spot) => String(spot.locationId) === String(locationId) && String(spot.dateHour) === dateHour,
  )
}

function hasRequestForDateHour(requests, locationId, dateHour) {
  return requests.some(
    (request) =>
      String(request.locationId) === String(locationId) && String(request.dateHour) === dateHour,
  )
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
  const unique = toUniqueDateHours(dateHours)

  const newRequests = []

  for (const dateHour of unique) {
    if (hasSpotForDateHour(existingSpots, locationId, dateHour)) {
      continue
    }

    if (hasRequestForDateHour(existingRequests, locationId, dateHour)) {
      continue
    }

    newRequests.push({ locationId, dateHour })
  }

  if (newRequests.length === 0) {
    return { error: 0, status: 200, data: activity }
  }

  return updateActivity(activity, {
    requestedSpotIds: existingRequests.concat(newRequests),
    requestedLocationId: locationId,
  })
}

async function removeRequestedSpots(activity, locationId, dateHours) {
  const unique = toUniqueDateHours(dateHours)

  if (unique.length === 0) {
    return { error: 0, status: 200, data: activity }
  }

  const existing = activity.requestedSpotIds || []
  const updated = existing.filter((request) => {
    const sameLocation = String(request.locationId) === String(locationId)
    const sameDate = unique.includes(String(request.dateHour))
    return !(sameLocation && sameDate)
  })

  let requestedLocationId
  if (updated.length === 0) {
    requestedLocationId = undefined
  } else {
    const prevLoc = activity.requestedLocationId
    const stillOnPrev = updated.some((request) => String(request.locationId) === String(prevLoc))
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
  const unique = toUniqueDateHours(dateHours)

  const updatedSpots = (activity.spotIds || []).slice()
  let updatedRequests = (activity.requestedSpotIds || []).slice()

  for (const dateHour of unique) {
    if (hasSpotForDateHour(updatedSpots, locationId, dateHour)) {
      continue
    }

    updatedSpots.push({ locationId, dateHour })
    updatedRequests = updatedRequests.filter((request) => {
      const sameLocation = String(request.locationId) === String(locationId)
      const sameDateHour = String(request.dateHour) === dateHour
      return !(sameLocation && sameDateHour)
    })
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
