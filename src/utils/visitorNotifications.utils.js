const STORAGE_KEY = 'visitor_notifications'

function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function getNotificationsForUser(userId) {
  const normalizedId = Number(userId)
  if (!Number.isInteger(normalizedId)) return []

  const queue = readQueue()
  return queue.filter((item) => Number(item.userId) === normalizedId)
}

export function enqueueNotificationsForUsers(userIds, message) {
  if (!Array.isArray(userIds) || userIds.length === 0 || !message) return

  const normalizedIds = [...new Set(userIds.map((id) => Number(id)).filter((id) => Number.isInteger(id)))]
  if (!normalizedIds.length) return

  const queue = readQueue()
  const now = Date.now()

  normalizedIds.forEach((userId, index) => {
    queue.push({
      id: `${now}-${userId}-${index}`,
      userId,
      message,
      createdAt: now,
    })
  })

  writeQueue(queue)
}

export function consumeNotificationsForUser(userId) {
  const normalizedId = Number(userId)
  if (!Number.isInteger(normalizedId)) return []

  const queue = readQueue()
  if (!queue.length) return []

  const forUser = queue.filter((item) => Number(item.userId) === normalizedId)
  const remaining = queue.filter((item) => Number(item.userId) !== normalizedId)

  if (forUser.length !== queue.length) {
    writeQueue(remaining)
  }

  return forUser
}

export function clearNotificationsForUser(userId) {
  const normalizedId = Number(userId)
  if (!Number.isInteger(normalizedId)) return

  const queue = readQueue()
  const remaining = queue.filter((item) => Number(item.userId) !== normalizedId)
  writeQueue(remaining)
}
