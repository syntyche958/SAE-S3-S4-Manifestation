import NotificationsService from '@/services/notifications.service'

export async function getNotificationsForUser(userId) {
  const normalizedId = Number(userId)
  if (!Number.isInteger(normalizedId)) return []

  const res = await NotificationsService.getForUser(normalizedId)
  if (res?.error === 0 && Array.isArray(res.data)) {
    return res.data
  }

  return []
}

export async function enqueueNotificationsForUsers(userIds, message) {
  if (!Array.isArray(userIds) || userIds.length === 0 || !message) return

  const normalizedIds = []
  for (const id of userIds) {
    const normalizedId = Number(id)
    if (!Number.isInteger(normalizedId)) {
      continue
    }
    if (!normalizedIds.includes(normalizedId)) {
      normalizedIds.push(normalizedId)
    }
  }

  if (!normalizedIds.length) return

  await NotificationsService.notifyUsers(normalizedIds, message)
}

export async function clearNotificationsForUser(userId) {
  const normalizedId = Number(userId)
  if (!Number.isInteger(normalizedId)) return

  await NotificationsService.clearForUser(normalizedId)
}
