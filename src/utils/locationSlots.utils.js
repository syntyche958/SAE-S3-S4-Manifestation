import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'

export function getActivityRequestingSlot(activities, locationId, dateHour) {
  const locStr = String(locationId)
  const dhStr = String(dateHour)

  for (const activity of activities) {
    for (const req of activity.requestedSpotIds || []) {
      if (String(req.locationId) === locStr && String(req.dateHour) === dhStr) {
        return activity
      }
    }
  }
  return null
}

export function getActivityWithConfirmedSlot(activities, locationId, dateHour) {
  const locStr = String(locationId)
  const dhStr = String(dateHour)

  for (const activity of activities) {
    for (const spot of activity.spotIds || []) {
      if (String(spot.locationId) === locStr && String(spot.dateHour) === dhStr) {
        return activity
      }
    }
  }
  return null
}

export function getAssignableActivitiesForAdminSlot(activities, locationId, dateHour) {
  const locStr = String(locationId)
  const dh = String(dateHour)

  const currentActivity = getActivityWithConfirmedSlot(activities, locationId, dateHour)
  const requestingActivity = getActivityRequestingSlot(activities, locationId, dateHour)

  if (currentActivity) {
    return activities
      .filter((a) => {
        if (a.id === currentActivity.id) return true

        const blockedElsewhere = (a.spotIds || []).some(
          (s) => String(s.dateHour) === dh && String(s.locationId) !== locStr,
        )
        return !blockedElsewhere
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const hasConfirmed = activities.some((a) =>
    (a.spotIds || []).some((s) => String(s.locationId) === locStr && String(s.dateHour) === dh),
  )
  if (hasConfirmed) return []

  const result = []

  for (const activity of activities) {
    const isRequester = requestingActivity && requestingActivity.id === activity.id
    if (isRequester) {
      result.push(activity)
      continue
    }

    const blockedElsewhere = (activity.spotIds || []).some(
      (s) => String(s.dateHour) === dh && String(s.locationId) !== locStr,
    )
    if (!blockedElsewhere) {
      result.push(activity)
    }
  }

  result.sort((a, b) => a.name.localeCompare(b.name))
  return result
}

export function getActivitiesAssignableToAllSlots(activities, locationId, dateHours) {
  if (!dateHours.length) return []

  const firstList = getAssignableActivitiesForAdminSlot(activities, locationId, dateHours[0])
  let ids = []
  for (const activity of firstList) {
    ids.push(activity.id)
  }

  for (let i = 1; i < dateHours.length; i++) {
    const nextList = getAssignableActivitiesForAdminSlot(activities, locationId, dateHours[i])
    const nextIds = []
    for (const activity of nextList) {
      nextIds.push(activity.id)
    }

    const commonIds = []
    for (const id of ids) {
      if (nextIds.includes(id)) {
        commonIds.push(id)
      }
    }
    ids = commonIds
  }

  return activities.filter((a) => ids.includes(a.id)).sort((x, y) => x.name.localeCompare(y.name))
}

export function buildAdminSlotsForLocation(activities, locationId, days, startHour, endHour) {
  const slots = []
  const locStr = String(locationId)
  for (const day of days) {
    for (let h = startHour; h <= endHour; h++) {
      const hourLabel = `${String(h).padStart(2, '0')}:00`
      const dateHour = `${day}T${hourLabel}`
      const hasSpot = activities.some((a) =>
        (a.spotIds || []).some(
          (s) => String(s.locationId) === locStr && String(s.dateHour) === dateHour,
        ),
      )
      const hasRequest = activities.some((a) =>
        (a.requestedSpotIds || []).some(
          (s) => String(s.locationId) === locStr && String(s.dateHour) === dateHour,
        ),
      )
      let status = ActivitySpotStatusEnum.ADMIN_FREE
      if (hasSpot) status = ActivitySpotStatusEnum.ADMIN_RESERVED
      else if (hasRequest) status = ActivitySpotStatusEnum.ADMIN_PENDING
      slots.push({ day, hour: hourLabel, dateHour, status })
    }
  }
  return slots
}

export function buildProviderSlots(
  availableDates,
  selectedLocationId,
  currentActivityId,
  activities,
  currentActivity,
  eventStartHour,
  eventEndHour,
) {
  const slots = []
  const locationIdStr = String(selectedLocationId)
  for (const day of availableDates) {
    for (let h = eventStartHour; h <= eventEndHour; h++) {
      const hourLabel = `${String(h).padStart(2, '0')}:00`
      const dateHour = `${day}T${hourLabel}`

      const mineSpot = (currentActivity?.spotIds || []).some(
        (s) => String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
      )
      const mineRequest = (currentActivity?.requestedSpotIds || []).some(
        (s) => String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
      )
      const takenByOther = activities.some((a) => {
        if (a.id === currentActivityId) return false
        const hasSpot = (a.spotIds || []).some(
          (s) => String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
        )
        const hasReq = (a.requestedSpotIds || []).some(
          (s) => String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
        )
        return hasSpot || hasReq
      })

      let status = ActivitySpotStatusEnum.PROVIDER_FREE
      if (mineSpot) status = ActivitySpotStatusEnum.PROVIDER_SELF
      else if (mineRequest) status = ActivitySpotStatusEnum.PROVIDER_PENDING
      else if (takenByOther) status = ActivitySpotStatusEnum.PROVIDER_OTHER

      slots.push({
        day,
        hour: hourLabel,
        dateHour,
        status,
      })
    }
  }
  return slots
}
