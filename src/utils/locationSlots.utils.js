import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'

/**
 * Activités pouvant recevoir une attribution confirmée sur (locationId, dateHour),
 * sans conflit ailleurs à la même heure ni avec un autre occupant / demandeur incompatible.
 */
export function getAssignableActivitiesForAdminSlot(activities, locationId, dateHour) {
  const locStr = String(locationId)
  const dh = String(dateHour)

  const hasConfirmed = activities.some((a) =>
    (a.spotIds || []).some(
      (s) => String(s.locationId) === locStr && String(s.dateHour) === dh,
    ),
  )
  if (hasConfirmed) return []

  const requesterIds = new Set()
  for (const a of activities) {
    for (const r of a.requestedSpotIds || []) {
      if (String(r.locationId) === locStr && String(r.dateHour) === dh) {
        requesterIds.add(a.id)
      }
    }
  }

  return activities
    .filter((a) => {
      const blockedElsewhere = (a.spotIds || []).some(
        (s) => String(s.dateHour) === dh && String(s.locationId) !== locStr,
      )
      if (blockedElsewhere) return false
      if (requesterIds.size > 0 && !requesterIds.has(a.id)) return false
      return true
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** Intersection des activités assignables sur chaque créneau. */
export function getActivitiesAssignableToAllSlots(activities, locationId, dateHours) {
  if (!dateHours.length) return []
  let ids = new Set(
    getAssignableActivitiesForAdminSlot(activities, locationId, dateHours[0]).map((a) => a.id),
  )
  for (let i = 1; i < dateHours.length; i++) {
    const next = new Set(
      getAssignableActivitiesForAdminSlot(activities, locationId, dateHours[i]).map((a) => a.id),
    )
    ids = new Set([...ids].filter((id) => next.has(id)))
  }
  return activities.filter((a) => ids.has(a.id)).sort((x, y) => x.name.localeCompare(y.name))
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

/**
 * Créneaux pour la vue prestataire (une activité courante, un emplacement).
 */
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
