<template>
  <Card>
    <template #content>
      <DataTable :value="sessions" tableStyle="min-width: 50rem">
        <Column field="reservedSlot" header="Créneau réservé">
          <template #body="slotProps">
            <Select
              :modelValue="getReservedSlotForSession(slotProps.data)"
              :options="reservedSlotOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un créneau"
              class="w-full"
              :disabled="reservedSlotOptions.length === 0"
              @update:modelValue="(value) => setSessionReservedSlot(slotProps.data, value)"
            />
          </template>
        </Column>
        <Column field="beginingHour" header="Heure début">
          <template #body="slotProps">
            <Select
              :modelValue="slotProps.data.beginingHour"
              :options="getStartHourOptionsForSession(slotProps.data)"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner une heure"
              class="w-full"
              :disabled="getStartHourOptionsForSession(slotProps.data).length === 0"
              @update:modelValue="(value) => setSessionBeginingHour(slotProps.data, value)"
            />
          </template>
        </Column>
        <Column field="duration" :header="$t('message.duration')">
          <template #body="slotProps">
            <InputNumber
              :modelValue="getSessionDuration(slotProps.data)"
              :min="1"
              :max="SLOT_DURATION_MINUTES"
              fluid
              @update:modelValue="(value) => setSessionDuration(slotProps.data, value)"
            />
          </template>
        </Column>
        <Column field="nbPlace" :header="$t('message.places')">
          <template #body="slotProps">
            <InputNumber v-model="slotProps.data.nbPlace" fluid />
          </template>
        </Column>
        <Column :header="$t('message.actions')">
          <template #body="slotProps">
            <Button
              icon="pi pi-check"
              severity="success"
              rounded
              outlined
              class="mr-2"
              :disabled="!isSessionModified(slotProps.data)"
              @click="validateSession(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              outlined
              @click="sessionStore.removeSession(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
      <div class="mt-4 flex justify-end">
        <Button
          icon="pi pi-plus"
          :label="$t('message.addSession')"
          severity="secondary"
          :disabled="reservedSlotOptions.length === 0"
          @click="addNewSession"
        />
      </div>
      <small v-if="reservedSlotOptions.length === 0" class="block mt-3 text-orange-400">
        Aucun créneau réservé pour cette activité. Réservez d'abord un emplacement horaire.
      </small>
    </template>
  </Card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
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
  normalizeSessionDuration,
  pickPreferredStartHour,
  splitDateHour,
} from '@/utils/sessionTimeSlots.utils'

const { t } = useI18n()
const route = useRoute()
const sessionStore = useSessionStore()
const activityStore = useActivityStore()
const savedSessionStates = ref({})

const activityId = computed(() => Number.parseInt(route.params.activity_id))
const currentActivity = computed(() => activityStore.get(activityId.value))

const sessions = computed(() => {
  if (!sessionStore.sessions) return []
  return sessionStore.sessions.filter((s) => s.activityId === activityId.value)
})

const defaultSessionDuration = computed(() => {
  const firstSessionWithDuration = sessions.value.find((s) => Number(s.duration) > 0)
  const fallback = firstSessionWithDuration ? Number(firstSessionWithDuration.duration) : 30
  return normalizeSessionDuration(fallback)
})

const reservedDateHours = computed(() => {
  return buildReservedDateHours(currentActivity.value?.spotIds || [])
})

const reservedSlotOptions = computed(() => {
  return buildReservedSlotOptions(reservedDateHours.value, formatEventDayFr)
})

async function addNewSession() {
  if (reservedDateHours.value.length === 0) {
    displayErrToast(t('message.noReservedSlotError'))
    return
  }

  const firstSlot = reservedDateHours.value[0]
  const split = splitDateHour(firstSlot)
  if (!split) return

  const duration = defaultSessionDuration.value
  const beginingHour = pickPreferredStartHour(
    firstSlot,
    getSlotStartHour(firstSlot),
    duration,
    sessions.value,
    undefined,
  )
  if (!beginingHour) {
    displayErrToast(t('message.invalidDurationForSlot'))
    return
  }

  await sessionStore.addSession(activityId.value, split.date, beginingHour, duration, 0)
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
    defaultSessionDuration.value,
  )
}

function syncSavedSessionsWithCurrentList() {
  const currentIds = new Set(sessions.value.map((session) => session.id))

  for (const session of sessions.value) {
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
    defaultSessionDuration.value,
  )
}

function getStartHourOptionsForSession(session) {
  return getStartHourOptionsForSessionUtil(session, sessions.value, defaultSessionDuration.value)
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
    session.duration = SLOT_DURATION_MINUTES
    session.beginingHour = getSlotStartHour(slot)
    return
  }

  session.duration = normalizedDuration
  session.beginingHour = validHour
}

async function validateSession(session) {
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

  await sessionStore.updateSession(session.id, {
    beginingDate: session.beginingDate,
    beginingHour: session.beginingHour,
    duration: session.duration,
    nbPlace: Number(session.nbPlace) || 0,
  })

  markSessionAsSaved(session)

  displaySuccessToast(t('message.sessionValidated'))
}

function normalizeSessionsWithActivityReservations() {
  if (!sessions.value.length) return
  if (!reservedDateHours.value.length) return

  const firstReservedDateHour = reservedDateHours.value[0]
  for (const session of sessions.value) {
    const currentSlot = getReservedSlotForSession(session)
    const isReservedSlot = reservedDateHours.value.includes(currentSlot)
    if (!isReservedSlot) {
      setSessionReservedSlot(session, firstReservedDateHour)
    } else {
      setSessionReservedSlot(session, currentSlot)
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
</script>
