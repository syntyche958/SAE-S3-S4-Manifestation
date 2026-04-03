const SLOT_DURATION_MINUTES = 60
const DEFAULT_START_STEP_MINUTES = 5

function toSafeInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

function parseTimeToMinutes(time) {
  const [hourRaw, minuteRaw] = String(time || '').split(':')
  const hour = toSafeInteger(hourRaw, -1)
  const minute = toSafeInteger(minuteRaw, -1)

  if (hour < 0 || hour > 23) return null
  if (minute < 0 || minute > 59) return null
  return hour * 60 + minute
}

function minutesToTime(minutes) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${pad2(hour)}:${pad2(minute)}`
}

function gcd(a, b) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const r = x % y
    x = y
    y = r
  }
  return x || 1
}

export function normalizeSessionDuration(duration, maxDuration = SLOT_DURATION_MINUTES) {
  const value = toSafeInteger(duration, 1)
  if (value < 1) return 1
  if (value > maxDuration) return maxDuration
  return value
}

export function splitDateHour(dateHour) {
  const [date, hour] = String(dateHour || '').split('T')
  if (!date || !hour) return null
  return { date, hour }
}

/** Clé stable pour comparer un créneau réservé (ignore secondes / fuseau / suffixes). */
export function normalizeDateHourKey(dateHour) {
  const s = String(dateHour || '').trim()
  const idx = s.indexOf('T')
  if (idx === -1) return ''
  const datePart = s.slice(0, idx)
  let timePart = s.slice(idx + 1).split('.')[0]
  if (timePart.endsWith('Z')) timePart = timePart.slice(0, -1)
  const parts = timePart.split(':')
  const h = toSafeInteger(parts[0], -1)
  const m = toSafeInteger(parts[1] ?? '0', 0)
  if (h < 0 || h > 23 || m < 0 || m > 59) return ''
  return `${datePart}T${pad2(h)}:${pad2(m)}`
}

export function formatEventDayFr(day) {
  const [year, month, date] = String(day).split('-').map(Number)
  const dt = new Date(year, month - 1, date)
  return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function buildReservedDateHours(spotIds = []) {
  const keys = new Set()
  for (const spot of spotIds || []) {
    const k = normalizeDateHourKey(spot?.dateHour)
    if (k.includes('T')) keys.add(k)
  }
  return [...keys].sort((a, b) => a.localeCompare(b))
}

export function buildReservedSlotOptions(reservedDateHours = [], formatDay = (day) => day) {
  return (reservedDateHours || []).map((dateHour) => {
    const [date, hour] = String(dateHour).split('T')
    return {
      label: `${formatDay(date)} - ${hour}`,
      value: dateHour,
    }
  })
}

export function getSlotStartHour(dateHour) {
  const slot = splitDateHour(dateHour)
  if (!slot) return ''
  return slot.hour
}

export function getReservedSlotFromSession(beginingDate, beginingHour) {
  if (!beginingDate || !beginingHour) return ''

  const total = parseTimeToMinutes(beginingHour)
  if (total == null) return ''

  const slotStartHour = Math.floor(total / 60)
  const raw = `${beginingDate}T${pad2(slotStartHour)}:00`
  return normalizeDateHourKey(raw)
}

export function buildStartHourOptions(dateHour, duration, stepMinutes) {
  const slot = splitDateHour(dateHour)
  if (!slot) return []

  const normalizedDuration = normalizeSessionDuration(duration)
  const slotStart = parseTimeToMinutes(slot.hour)
  if (slotStart == null) return []

  const slotEnd = slotStart + SLOT_DURATION_MINUTES
  const maxStart = slotEnd - normalizedDuration
  if (maxStart < slotStart) return []

  const computedStep = gcd(normalizedDuration, SLOT_DURATION_MINUTES)
  const safeStep = Math.max(
    1,
    stepMinutes == null ? computedStep : toSafeInteger(stepMinutes, DEFAULT_START_STEP_MINUTES),
  )
  const options = []
  for (let start = slotStart; start <= maxStart; start += safeStep) {
    const hhmm = minutesToTime(start)
    options.push({ label: hhmm, value: hhmm })
  }

  return options
}

function overlapsInterval(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

function getSessionInterval(session) {
  const start = parseTimeToMinutes(session?.beginingHour)
  if (start == null) return null

  const duration = normalizeSessionDuration(session?.duration)
  return {
    id: session?.id,
    slot: getReservedSlotFromSession(session?.beginingDate, session?.beginingHour),
    start,
    end: start + duration,
  }
}

export function buildChainedStartHourOptions(dateHour, duration, sessions, currentSessionId) {
  const slot = splitDateHour(dateHour)
  if (!slot) return []

  const normalizedDuration = normalizeSessionDuration(duration)
  const slotStart = parseTimeToMinutes(slot.hour)
  if (slotStart == null) return []

  const slotEnd = slotStart + SLOT_DURATION_MINUTES
  const maxStart = slotEnd - normalizedDuration
  if (maxStart < slotStart) return []

  const intervals = (sessions || [])
    .filter((session) => session?.id !== currentSessionId)
    .map((session) => getSessionInterval(session))
    .filter((interval) => interval && interval.slot === dateHour)
    .filter((interval) => interval.start >= slotStart && interval.end <= slotEnd)
    .sort((a, b) => a.start - b.start)

  const candidates = new Set([slotStart])
  for (const interval of intervals) {
    candidates.add(interval.end)
  }

  const sortedCandidates = [...candidates].sort((a, b) => a - b)
  const validStarts = sortedCandidates.filter((start) => {
    if (start < slotStart || start > maxStart) return false
    const end = start + normalizedDuration
    return !intervals.some((interval) => overlapsInterval(start, end, interval.start, interval.end))
  })

  return validStarts.map((start) => {
    const hhmm = minutesToTime(start)
    return { label: hhmm, value: hhmm }
  })
}

export function pickPreferredStartHour(
  dateHour,
  preferredHour,
  duration,
  sessions,
  currentSessionId,
) {
  const options = buildChainedStartHourOptions(dateHour, duration, sessions, currentSessionId)
  if (!options.length) return ''

  const preferred = String(preferredHour || '')
  if (options.some((opt) => opt.value === preferred)) return preferred
  return options[0].value
}

export function getSessionDurationOrDefault(session, defaultDuration) {
  return normalizeSessionDuration(session?.duration ?? defaultDuration)
}

export function getStartHourOptionsForSession(session, sessions, defaultDuration) {
  const slot = getReservedSlotFromSession(session?.beginingDate, session?.beginingHour)
  const duration = getSessionDurationOrDefault(session, defaultDuration)
  return buildChainedStartHourOptions(slot, duration, sessions, session?.id)
}

export function buildSessionStateSnapshot(session, defaultDuration) {
  return {
    beginingDate: String(session?.beginingDate || ''),
    beginingHour: String(session?.beginingHour || ''),
    duration: getSessionDurationOrDefault(session, defaultDuration),
    nbPlace: Number(session?.nbPlace) || 0,
  }
}

export function isSessionStateModified(session, savedSnapshot, defaultDuration) {
  if (!savedSnapshot) return true

  const current = buildSessionStateSnapshot(session, defaultDuration)
  return (
    current.beginingDate !== savedSnapshot.beginingDate ||
    current.beginingHour !== savedSnapshot.beginingHour ||
    current.duration !== savedSnapshot.duration ||
    current.nbPlace !== savedSnapshot.nbPlace
  )
}

export function isSessionTimeValidInSlot(dateHour, beginingHour, duration) {
  const slot = splitDateHour(dateHour)
  if (!slot) return false

  const slotStart = parseTimeToMinutes(slot.hour)
  const sessionStart = parseTimeToMinutes(beginingHour)
  if (slotStart == null || sessionStart == null) return false

  const normalizedDuration = normalizeSessionDuration(duration)
  const slotEnd = slotStart + SLOT_DURATION_MINUTES
  const sessionEnd = sessionStart + normalizedDuration

  return sessionStart >= slotStart && sessionEnd <= slotEnd
}

export function pickValidStartHour(dateHour, beginingHour, duration) {
  const options = buildStartHourOptions(dateHour, duration)
  if (!options.length) return ''

  const current = String(beginingHour || '')
  if (options.some((opt) => opt.value === current)) return current
  return options[0].value
}

export { SLOT_DURATION_MINUTES }
