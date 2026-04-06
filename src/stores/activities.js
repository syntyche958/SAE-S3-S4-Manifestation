import { ref } from 'vue'
import { defineStore } from 'pinia'

import activityService from '@/services/activity.service'
import { useProviderStore } from '@/stores/providers'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import { enqueueNotificationsForUsers } from '@/utils/visitorNotifications.utils'
import i18n from '@/i18n'

const { t } = i18n.global

function toUniqueStringList(values = []) {
  const unique = []
  for (const value of values) {
    const normalized = String(value)
    if (!unique.includes(normalized)) {
      unique.push(normalized)
    }
  }
  return unique
}

function buildSlotKeys(locationId, dateHours) {
  const keys = new Set()
  for (const dateHour of dateHours) {
    keys.add(`${locationId}-${dateHour}`)
  }
  return keys
}

function removeSpotsFromList(list, slotKeys) {
  const cleaned = []
  for (const spot of list || []) {
    if (!slotKeys.has(`${spot.locationId}-${spot.dateHour}`)) {
      cleaned.push(spot)
    }
  }
  return cleaned
}

function resolveRequestedLocationId(requestedSpots, currentRequestedLocationId, locationId) {
  if (requestedSpots.length === 0 && currentRequestedLocationId === locationId) {
    return undefined
  }
  return currentRequestedLocationId
}

function buildBulkUpdatePlan(allActivities, activityId, locationId, uniqueDateHours, slotKeys) {
  const plan = []

  for (const activity of allActivities || []) {
    const cleanedSpots = removeSpotsFromList(activity.spotIds || [], slotKeys)
    const cleanedRequests = removeSpotsFromList(activity.requestedSpotIds || [], slotKeys)

    if (activity.id !== activityId) {
      plan.push({
        activity,
        overrides: {
          spotIds: cleanedSpots,
          requestedSpotIds: cleanedRequests,
          requestedLocationId: resolveRequestedLocationId(
            cleanedRequests,
            activity.requestedLocationId,
            locationId,
          ),
        },
      })
      continue
    }

    const mergedSpots = [...cleanedSpots]
    for (const dateHour of uniqueDateHours) {
      mergedSpots.push({ locationId, dateHour })
    }

    plan.push({
      activity,
      overrides: {
        locationId,
        spotIds: mergedSpots,
        requestedSpotIds: cleanedRequests,
        requestedLocationId: resolveRequestedLocationId(
          cleanedRequests,
          activity.requestedLocationId,
          locationId,
        ),
      },
    })
  }

  return plan
}

function buildRequestedSpotsToRemove(activity, locationId, dateHours) {
  const uniqueDateHours = toUniqueStringList(dateHours)
  const removeKeys = buildSlotKeys(String(locationId), uniqueDateHours)

  const requestedSpotsToRemove = []
  for (const request of activity.requestedSpotIds || []) {
    const key = `${String(request.locationId)}-${String(request.dateHour)}`
    if (removeKeys.has(key)) {
      requestedSpotsToRemove.push(request)
    }
  }

  return {
    uniqueDateHours,
    requestedSpotsToRemove,
  }
}

async function notifyProviderRefusedSpots(activity, requestedSpotsToRemove, reason) {
  const providerStore = useProviderStore()
  const provider = providerStore.get(activity.providerId)
  const providerUserId = provider?.userId

  if (providerUserId == null) return

  const reasonPart = reason ? ` Motif : ${reason}` : ''
  const n = requestedSpotsToRemove.length
  const body =
    n === 1
      ? t('message.refusePlacementNotifyOne', { name: activity.name, reasonPart })
      : t('message.refusePlacementNotifyMany', { name: activity.name, n, reasonPart })

  await enqueueNotificationsForUsers([providerUserId], body)
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])

  async function getAllActivities() {
    let response = await activityService.getAllActivities()
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  function get(activityId) {
    const id = Number(activityId)
    return activities.value.find((a) => Number(a.id) === id)
  }

  function getAvailableDateHoursForLocation(activityId, locationId, dateHours = []) {
    const selfId = Number(activityId)
    const occupiedKeys = new Set()

    for (const activity of activities.value || []) {
      if (Number(activity.id) === selfId) continue

      for (const spot of activity.spotIds || []) {
        occupiedKeys.add(`${spot.locationId}-${spot.dateHour}`)
      }
      for (const request of activity.requestedSpotIds || []) {
        occupiedKeys.add(`${request.locationId}-${request.dateHour}`)
      }
    }

    const uniqueDateHours = []
    for (const dateHour of dateHours || []) {
      const value = String(dateHour)
      if (!uniqueDateHours.includes(value)) {
        uniqueDateHours.push(value)
      }
    }

    const available = []
    for (const dateHour of uniqueDateHours) {
      if (!occupiedKeys.has(`${locationId}-${dateHour}`)) {
        available.push(dateHour)
      }
    }

    return available
  }

  async function updateLocationId(activity_id, locationId) {
    const activity = get(activity_id)
    if (!activity) return

    let response = await activityService.updateLocationId(activity, locationId)
    if (response.error === 0) await getAllActivities()
    else console.log(response.data)
  }

  async function addRequestedSpots(activityId, locationId, dateHours) {
    const activity = get(activityId)
    if (!activity) return

    const availableDateHours = getAvailableDateHoursForLocation(activityId, locationId, dateHours)
    if (availableDateHours.length === 0) return

    const response = await activityService.addRequestedSpots(
      activity,
      locationId,
      availableDateHours,
    )
    if (response.error === 0) await getAllActivities()
    else console.log(response.data)
  }

  async function updateRequestedLocationId(activityId, requestedLocationId, dateHours = []) {
    if (Array.isArray(dateHours) && dateHours.length > 0) {
      await addRequestedSpots(activityId, requestedLocationId, dateHours)
    }
  }

  async function addSpot(activityId, locationId, dateHour) {
    const activity = get(activityId)
    if (!activity) return

    let response = await activityService.addSpotsBulk(activity, locationId, [dateHour])
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.spotAssignedSuccess'))
    } else {
      displayErrToast(t('message.spotAssignFailed'))
    }
  }

  async function addSpotsBulk(activityId, locationId, dateHours) {
    const activity = get(activityId)
    if (!activity) return

    const uniqueDateHours = toUniqueStringList(dateHours || [])
    if (uniqueDateHours.length === 0) return

    const slotKeys = buildSlotKeys(locationId, uniqueDateHours)
    const nextActivities = buildBulkUpdatePlan(
      activities.value,
      activityId,
      locationId,
      uniqueDateHours,
      slotKeys,
    )

    let hasError = false
    for (const item of nextActivities) {
      const response = await activityService.updateActivity(item.activity, item.overrides)
      if (response.error !== 0) {
        hasError = true
        break
      }
    }

    if (hasError) {
      displayErrToast(t('message.spotsAssignFailed'))
      return
    }

    await getAllActivities()
    const n = uniqueDateHours.length
    displaySuccessToast(
      n > 1 ? t('message.spotsAssignedSuccess', { n }) : t('message.spotAssignedSuccess'),
    )
  }

  async function add(providerId, name, desc) {
    const locale = i18n.global.locale.value
    let response = await activityService.addToLocalSource(providerId, name, desc, locale)
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.activityAddedSuccess'))
    } else {
      displayErrToast(t('message.activityAddedFailed'))
      console.log(response.data)
    }
  }

  async function refuseRequestedLocation(activityId, locationId, dateHours, reason) {
    const activity = activities.value.find((a) => a.id === activityId)
    if (!activity) {
      displayErrToast(t('message.activityNotFound'))
      return
    }

    const { uniqueDateHours, requestedSpotsToRemove } = buildRequestedSpotsToRemove(
      activity,
      locationId,
      dateHours,
    )

    if (requestedSpotsToRemove.length === 0) {
      displayErrToast(t('message.refusePlacementNothingToRemove'))
      return
    }

    const response = await activityService.removeRequestedSpots(
      activity,
      locationId,
      uniqueDateHours,
    )

    if (response.error === 0) {
      await getAllActivities()

      await notifyProviderRefusedSpots(activity, requestedSpotsToRemove, reason)

      displaySuccessToast(
        requestedSpotsToRemove.length === 1
          ? t('message.refusePlacementSuccessOne')
          : t('message.refusePlacementSuccessMany', { n: requestedSpotsToRemove.length }),
      )
    } else {
      displayErrToast(t('message.refusePlacementFailed'))
      console.log(response.data)
    }
  }

  async function addRating(activityId, userId, note) {
    let response = await activityService.addActivityRating(activityId, userId, note)
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.ratingRecorded'))
    } else {
      displayErrToast(t('message.ratingFailed'))
      console.log(response.data)
    }
  }

  async function addComment(activityId, userId, title, content) {
    let response = await activityService.addActivityComment(activityId, userId, title, content)
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.commentPublished'))
    } else {
      displayErrToast(t('message.commentFailed'))
      console.log(response.data)
    }
  }

  async function addCommentReply(activityId, commentIndex, replyContent) {
    let response = await activityService.replyToActivityComment(
      activityId,
      commentIndex,
      replyContent,
    )
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.replyPublished'))
    } else {
      displayErrToast(t('message.replyFailed'))
      console.log(response.data)
    }
  }

  async function updateServiceFlags(activityId, payload) {
    const activity = get(activityId)
    if (!activity) {
      displayErrToast(t('message.serviceFlagsUpdateFailed'))
      return
    }

    const response = await activityService.updateActivity(activity, payload)
    if (response.error === 0) {
      await getAllActivities()
      displaySuccessToast(t('message.serviceFlagsUpdated'))
    } else {
      displayErrToast(t('message.serviceFlagsUpdateFailed'))
      console.log(response.data)
    }
  }

  return {
    getAllActivities,
    get,
    add,
    addSpot,
    addSpotsBulk,
    updateLocationId,
    refuseRequestedLocation,
    updateRequestedLocationId,
    addRequestedSpots,
    addRating,
    addComment,
    addCommentReply,
    activities,
    updateServiceFlags,
  }
})
