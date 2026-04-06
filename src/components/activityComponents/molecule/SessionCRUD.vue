<template>
  <Card>
    <template #content>
      <DataTable :value="sessions" dataKey="id" :rowClass="getSessionRowClass" tableStyle="min-width: 50rem">
        <Column field="reservedSlot" header="Créneau réservé">
          <template #body="slotProps">
            <div class="session-status-cell" :class="getSessionStatusClass(slotProps.data)">
              <Select :modelValue="getReservedSlotForSession(slotProps.data)" :options="reservedSlotOptions"
                optionLabel="label" optionValue="value" placeholder="Sélectionner un créneau" class="w-full"
                :disabled="reservedSlotOptions.length === 0"
                @update:modelValue="(value) => setSessionReservedSlot(slotProps.data, value)" />
            </div>
          </template>
        </Column>
        <Column field="beginingHour" header="Heure début">
          <template #body="slotProps">
            <Select :modelValue="slotProps.data.beginingHour" :options="getStartHourOptionsForSession(slotProps.data)"
              optionLabel="label" optionValue="value" placeholder="Sélectionner une heure" class="w-full"
              :disabled="getStartHourOptionsForSession(slotProps.data).length === 0"
              @update:modelValue="(value) => setSessionBeginingHour(slotProps.data, value)" />
          </template>
        </Column>
        <Column field="duration" :header="$t('message.duration')">
          <template #body="slotProps">
            <InputNumber :modelValue="getSessionDuration(slotProps.data)" :min="1" :max="SLOT_DURATION_MINUTES" fluid
              @update:modelValue="(value) => setSessionDuration(slotProps.data, value)" />
          </template>
        </Column>
        <Column field="nbPlace" :header="$t('message.places')">
          <template #body="slotProps">
            <InputNumber :modelValue="slotProps.data.nbPlace" fluid
              @update:modelValue="(value) => setSessionNbPlace(slotProps.data, value)" />
          </template>
        </Column>
        <Column :header="$t('message.actions')">
          <template #body="slotProps">
            <Button icon="pi pi-check" severity="success" rounded outlined class="mr-2"
              :disabled="!isSessionModifiedTracked(slotProps.data)" @click="validateSession(slotProps.data)" />
            <Button icon="pi pi-trash" severity="danger" rounded outlined @click="removeSessionRow(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <div class="mt-4 flex justify-end">
        <Button icon="pi pi-plus" :label="$t('message.addSession')" severity="secondary" :disabled="!canAddSession"
          @click="addNewSession" />
      </div>
      <small v-if="reservedSlotOptions.length === 0" class="block mt-3 text-orange-400">
        Aucun créneau réservé pour cette activité. Réservez d'abord un emplacement horaire.
      </small>
      <small v-else-if="!canAddSession" class="block mt-3 text-orange-400">
        Tous les créneaux réservés sont complets pour cette activité.
      </small>
    </template>
  </Card>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/sessions.js'
import { useActivityStore } from '@/stores/activities'
import { computed, onMounted, ref, watch } from 'vue'
import { InputNumber, Button, DataTable, Column, Card, Select } from 'primevue'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import {
  SLOT_DURATION_MINUTES,
  buildReservedDateHours,
  buildReservedSlotOptions,
  buildSessionStateSnapshot,
  formatEventDayFr,
  getSessionDurationOrDefault,
  getStartHourOptionsForSession as getStartHourOptionsForSessionUtil,
  getReservedSlotFromSession,
  getSlotStartHour,
  isSessionStateModified,
  isSessionTimeValidInSlot,
  normalizeSessionDuration,
  pickPreferredStartHour,
  splitDateHour,
} from '@/utils/sessionTimeSlots.utils'

const { t } = useI18n()
const route = useRoute()
const sessionStore = useSessionStore()
const activityStore = useActivityStore()
const savedSessionStates = ref({})
const sessionStateVersion = ref(0)

const activityId = computed(() => Number.parseInt(route.params.activity_id, 10))
const currentActivity = computed(() => activityStore.get(activityId.value))

const sessions = computed(() => {
  if (!sessionStore.sessions) return []
  const aid = activityId.value
  return sessionStore.sessions.filter((s) => Number(s.activityId) === aid)
})

const defaultSessionDuration = computed(() => {
  let shortestDuration = null

  for (const session of sessions.value) {
    const duration = Number(session.duration)
    if (duration <= 0) continue

    if (shortestDuration == null || duration < shortestDuration) {
      shortestDuration = duration
    }
  }

  const fallback = shortestDuration == null ? 30 : shortestDuration
  return normalizeSessionDuration(fallback)
})

const reservedDateHours = computed(() => {
  return buildReservedDateHours(currentActivity.value?.spotIds || [])
})

const reservedSlotOptions = computed(() => {
  return buildReservedSlotOptions(reservedDateHours.value, formatEventDayFr)
})

const canAddSession = computed(() => {
  const duration = defaultSessionDuration.value
  return reservedDateHours.value.some((slot) => {
    const startHour = getSlotStartHour(slot)
    return Boolean(pickPreferredStartHour(slot, startHour, duration, sessions.value, undefined))
  })
})

function findFirstAvailableSlot(duration) {
  for (const slot of reservedDateHours.value) {
    const startHour = getSlotStartHour(slot)
    const beginingHour = pickPreferredStartHour(slot, startHour, duration, sessions.value, undefined)
    if (beginingHour) {
      return { slot, beginingHour }
    }
  }

  return null
}

function isDraftSession(session) {
  return Number(session?.id) < 0
}

function getNextDraftSessionId() {
  const numericIds = sessions.value
    .map((session) => Number(session.id))
    .filter((id) => Number.isFinite(id))

  const minId = Math.min(0, ...numericIds)
  return minId - 1
}

async function addNewSession() {
  if (reservedDateHours.value.length === 0) {
    displayErrToast(t('message.noReservedSlotError'))
    return
  }

  const duration = defaultSessionDuration.value
  const availableSlot = findFirstAvailableSlot(duration)
  if (!availableSlot) {
    displayErrToast(t('message.invalidDurationForSlot'))
    return
  }

  const split = splitDateHour(availableSlot.slot)
  if (!split) return

  if (!sessionStore.sessions) {
    sessionStore.sessions = []
  }

  sessionStore.sessions.push({
    id: getNextDraftSessionId(),
    activityId: activityId.value,
    beginingDate: split.date,
    beginingHour: availableSlot.beginingHour,
    duration,
    nbPlace: 0,
    registersUsers: [],
  })
}

function getReservedSlotForSession(session) {
  return getReservedSlotFromSession(session?.beginingDate, session?.beginingHour)
}

function getSessionDuration(session) {
  return getSessionDurationOrDefault(session, defaultSessionDuration.value)
}

function markSessionAsSaved(session) {
  savedSessionStates.value[session.id] = buildSessionStateSnapshot(
    session,
    SLOT_DURATION_MINUTES,
  )
  sessionStateVersion.value += 1
}

function syncSavedSessionsWithCurrentList() {
  const currentIds = new Set(sessions.value.map((session) => session.id))

  for (const session of sessions.value) {
    if (isDraftSession(session)) continue

    if (!savedSessionStates.value[session.id]) {
      markSessionAsSaved(session)
    }
  }

  for (const savedId of Object.keys(savedSessionStates.value)) {
    if (!currentIds.has(Number(savedId))) {
      delete savedSessionStates.value[savedId]
    }
  }
}

function isSessionModified(session) {
  return isSessionStateModified(
    session,
    savedSessionStates.value[session.id],
    SLOT_DURATION_MINUTES,
  )
}

function isSessionModifiedTracked(session) {
  const stateVersion = sessionStateVersion.value
  return stateVersion >= 0 && isSessionModified(session)
}

function getSessionStatusClass(session) {
  return isSessionModifiedTracked(session) ? 'session-status-cell--dirty' : 'session-status-cell--saved'
}

function getSessionRowClass(session) {
  return isSessionModified(session) ? 'session-row--dirty' : 'session-row--saved'
}

function getStartHourOptionsForSession(session) {
  const options = getStartHourOptionsForSessionUtil(session, sessions.value, defaultSessionDuration.value)
  const currentHour = String(session?.beginingHour || '')
  if (!currentHour) return options

  if (options.some((option) => option.value === currentHour)) {
    return options
  }

  const slot = getReservedSlotForSession(session)
  const duration = getSessionDuration(session)
  const isCurrentHourValid = isSessionTimeValidInSlot(slot, currentHour, duration)
  if (!isCurrentHourValid) return options

  return [...options, { label: currentHour, value: currentHour }].sort((a, b) =>
    a.value.localeCompare(b.value),
  )
}

function setSessionReservedSlot(session, dateHour) {
  const slot = splitDateHour(dateHour)
  if (!slot) return

  const duration = getSessionDuration(session)
  const beginingHour = pickPreferredStartHour(
    dateHour,
    session.beginingHour,
    duration,
    sessions.value,
    session.id,
  )
  if (!beginingHour) {
    displayErrToast(t('message.durationTooLongForSlot'))
    return
  }

  session.beginingDate = slot.date
  session.beginingHour = beginingHour
  session.duration = duration
  sessionStateVersion.value += 1
}

function setSessionBeginingHour(session, beginingHour) {
  const slot = getReservedSlotForSession(session)
  const validHour = pickPreferredStartHour(
    slot,
    beginingHour,
    getSessionDuration(session),
    sessions.value,
    session.id,
  )
  if (!validHour) return

  session.beginingHour = validHour
  sessionStateVersion.value += 1
}

function setSessionDuration(session, duration) {
  const normalizedDuration = normalizeSessionDuration(duration)
  const slot = getReservedSlotForSession(session)
  const validHour = pickPreferredStartHour(
    slot,
    session.beginingHour,
    normalizedDuration,
    sessions.value,
    session.id,
  )

  if (!validHour) {
    displayErrToast(t('message.sessionImpossibleDuration'))
    return
  }

  session.duration = normalizedDuration
  session.beginingHour = validHour
  sessionStateVersion.value += 1
}

function setSessionNbPlace(session, value) {
  session.nbPlace = Number(value) || 0
  sessionStateVersion.value += 1
}

async function removeSessionRow(session) {
  if (isDraftSession(session)) {
    if (!sessionStore.sessions) return
    sessionStore.sessions = sessionStore.sessions.filter((item) => item.id !== session.id)
    return
  }

  await sessionStore.removeSession(session.id)
}

async function validateSession(session) {
  const isDraft = isDraftSession(session)
  const slot = getReservedSlotForSession(session)
  const beginingHour = pickPreferredStartHour(
    slot,
    session.beginingHour,
    getSessionDuration(session),
    sessions.value,
    session.id,
  )

  if (!beginingHour) {
    displayErrToast(t('message.noValidHourForSession'))
    return
  }

  session.beginingHour = beginingHour
  session.duration = getSessionDuration(session)

  let response

  if (isDraft) {
    response = await sessionStore.addSession(
      Number(session.activityId) || activityId.value,
      session.beginingDate,
      session.beginingHour,
      session.duration,
      Number(session.nbPlace) || 0,
    )
  } else {
    response = await sessionStore.updateSession(session.id, {
      activityId: Number(session.activityId) || activityId.value,
      beginingDate: session.beginingDate,
      beginingHour: session.beginingHour,
      duration: session.duration,
      nbPlace: Number(session.nbPlace) || 0,
    })
  }

  if (!response || response.error !== 0) {
    displayErrToast(t('message.sessionValidationFailed'))
    return
  }

  if (isDraft) {
    const createdSession = response.data
    if (Array.isArray(sessionStore.sessions)) {
      const draftIndex = sessionStore.sessions.findIndex((item) => item.id === session.id)
      const createdIndex = sessionStore.sessions.findIndex((item) => item.id === createdSession.id)

      if (createdIndex !== -1) {
        sessionStore.sessions.splice(createdIndex, 1)
      }

      if (draftIndex !== -1) {
        sessionStore.sessions.splice(draftIndex, 1, createdSession)
      }
    }

    if (savedSessionStates.value[session.id]) {
      delete savedSessionStates.value[session.id]
    }

    markSessionAsSaved(createdSession)
  } else {
    markSessionAsSaved(response.data || session)
  }

  displaySuccessToast(t('message.sessionValidated'))
}

function normalizeSessionsWithActivityReservations() {
  if (!sessions.value.length) return
  if (!reservedDateHours.value.length) return

  const firstReservedDateHour = reservedDateHours.value[0]
  for (const session of sessions.value) {
    const currentSlot = getReservedSlotForSession(session)
    const isReservedSlot = reservedDateHours.value.includes(currentSlot)
    if (isReservedSlot) {
      setSessionReservedSlot(session, currentSlot)
    } else {
      setSessionReservedSlot(session, firstReservedDateHour)
    }
  }
}

onMounted(async () => {
  if (!sessionStore.sessions || sessionStore.sessions.length === 0) {
    await sessionStore.getAllSessions()
  }
  if (!activityStore.activities || activityStore.activities.length === 0) {
    await activityStore.getAllActivities()
  }

  normalizeSessionsWithActivityReservations()
  syncSavedSessionsWithCurrentList()
})

watch(
  () => sessions.value.map((session) => session.id).join(','),
  () => {
    syncSavedSessionsWithCurrentList()
  },
)

watch(reservedDateHours, () => {
  normalizeSessionsWithActivityReservations()
  syncSavedSessionsWithCurrentList()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr.session-row--saved > td) {
  background-color: inherit;
}

:deep(.p-datatable .p-datatable-tbody > tr.session-row--dirty > td) {
  background-color: inherit;
}

.session-status-cell {
  box-shadow: inset 5px 0 0 transparent;
  padding-left: 0.35rem;
}

.session-status-cell--saved {
  box-shadow: inset 5px 0 0 #22c55e;
}

.session-status-cell--dirty {
  box-shadow: inset 5px 0 0 #f59e0b;
}
</style>
