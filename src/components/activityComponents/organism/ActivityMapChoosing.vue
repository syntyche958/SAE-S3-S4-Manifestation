<template>
  <div class="flex gap-6">
    <TheMap
      id="activity-map"
      :display-mode="MapModeEnum.PROVIDER"
      @change-selected-location="onChangeSelectedLocation"
      class="w-fit"
      classSize="sm:h-[60vh] sm:w-[60vw]"
    />

    <Card v-if="selectedLocation != null">
      <template #title>{{ $t('message.characteristicsOfTheSelectedLocation') }}</template>
      <template #content>
        <LocationCharacteristics :selected-location="selectedLocation" :display-title="false" />

        <div class="mt-4 flex flex-col gap-4">
          <AvailabilityHoursContainer :available-dates="availableDates" :slots-by-day="slotsByDay" />
          <LocationRequestsReservations
            :available-dates="availableDates"
            :hour-options="availableHourOptions"
            :request-rows="requestRows"
            :is-adding-row="isAddingRow"
            :draft-day="draftDay"
            :draft-hour="draftHour"
            @start-add-row="startAddRow"
            @add-request-row="addRequestRow"
            @update:draft-day="draftDay = $event"
            @update:draft-hour="draftHour = $event"
          />
        </div>
      </template>
    </Card>
    <Card v-else
      ><template #title>{{ $t('message.noLocationSelected') }}</template
      ><template #content>{{ $t('message.clickOnLocation') }}</template></Card
    >
  </div>
</template>

<script setup>
import { Card } from 'primevue'
import { MapModeEnum } from '@/enums/Map.enums'
import TheMap from '@/components/globalComponents/molecule/TheMap.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useRoute } from 'vue-router'
import LocationCharacteristics from '@/components/globalComponents/molecule/LocationCharacteristics.vue'
import AvailabilityHoursContainer from '@/components/activityComponents/molecule/AvailabilityHoursContainer.vue'
import LocationRequestsReservations from '@/components/activityComponents/molecule/LocationRequestsReservations.vue'
import { useSessionStore } from '@/stores/sessions'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'

const locationStore = useLocationStore()
const activityStore = useActivityStore()
const route = useRoute()
const sessionStore = useSessionStore()

const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)
const onChangeSelectedLocation = (locationId) => {
  selectedLocationId.value = locationId
}

const currentActivityId = computed(() => Number(route.params.activity_id))
const hourOptions = computed(() => {
  const options = []
  for (let h = EVENT_START_HOUR; h <= EVENT_END_HOUR; h++) {
    options.push(`${String(h).padStart(2, '0')}:00`)
  }
  return options
})

const availableDates = computed(() => {
  const activity = activityStore.get(currentActivityId.value)
  const dates = new Set(EVENT_DAYS)

  ;(activity?.spotIds || []).forEach((s) => dates.add(String(s.dateHour).split('T')[0]))
  ;(activity?.requestedSpotIds || []).forEach((s) => dates.add(String(s.dateHour).split('T')[0]))

  ;(
    (sessionStore.sessions || [])
      .filter((s) => s.activitiesId === currentActivityId.value)
      .map((s) => s.beginingDate)
  ).forEach((d) => dates.add(d))

  return Array.from(dates).sort()
})

const draftDay = ref(EVENT_DAYS[0])
const draftHour = ref(hourOptions.value[0])
const isAddingRow = ref(false)

watch(availableDates, (days) => {
  if (!days || days.length === 0) return
  if (!draftDay.value || !days.includes(draftDay.value)) draftDay.value = days[0]
})

const allSlots = computed(() => {
  const slots = []
  for (const day of availableDates.value) {
    for (let h = EVENT_START_HOUR; h <= EVENT_END_HOUR; h++) {
      const hourLabel = `${String(h).padStart(2, '0')}:00`
      const dateHour = `${day}T${hourLabel}`
      const locationIdStr = String(selectedLocationId.value)

      const occupied = activityStore.activities.some(
        (a) =>
          (a.spotIds || []).some(
            (s) => String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
          ),
      )
      const pending = !occupied
        ? activityStore.activities.some(
            (a) =>
              (a.requestedSpotIds || []).some(
                (s) =>
                  String(s.locationId) === locationIdStr && String(s.dateHour) === dateHour,
              ),
          )
        : false

      slots.push({
        day,
        hour: hourLabel,
        dateHour,
        status: occupied
          ? ActivitySpotStatusEnum.OCCUPIED
          : pending
            ? ActivitySpotStatusEnum.PENDING
            : ActivitySpotStatusEnum.AVAILABLE,
      })
    }
  }
  return slots
})

const availableHourOptions = computed(() => {
  if (!draftDay.value) return []
  return allSlots.value
    .filter((s) => s.day === draftDay.value && s.status === ActivitySpotStatusEnum.AVAILABLE)
    .map((s) => s.hour)
})

watch(availableHourOptions, (hours) => {
  if (!hours || hours.length === 0) {
    draftHour.value = ''
    return
  }
  if (!hours.includes(draftHour.value)) draftHour.value = hours[0]
})

const slotsByDay = computed(() => {
  const grouped = {}
  for (const day of availableDates.value) {
    grouped[day] = allSlots.value.filter((s) => s.day === day)
  }
  return grouped
})

const requestRows = computed(() => {
  const activity = activityStore.get(currentActivityId.value)
  if (!activity || !selectedLocationId.value) return []
  const rows = []
  const locationIdStr = String(selectedLocationId.value)

  for (const spot of activity.spotIds || []) {
    if (String(spot.locationId) !== locationIdStr) continue
    const [day, hour] = String(spot.dateHour).split('T')
    rows.push({ key: `a-${spot.dateHour}`, day, hour, status: ActivitySpotStatusEnum.ACCEPTED })
  }
  for (const spot of activity.requestedSpotIds || []) {
    if (String(spot.locationId) !== locationIdStr) continue
    const [day, hour] = String(spot.dateHour).split('T')
    rows.push({ key: `p-${spot.dateHour}`, day, hour, status: ActivitySpotStatusEnum.PENDING })
  }
  return rows.sort((a, b) => `${a.day}T${a.hour}`.localeCompare(`${b.day}T${b.hour}`))
})

function startAddRow() {
  isAddingRow.value = true
  draftDay.value = availableDates.value[0]
  draftHour.value = availableHourOptions.value[0] || ''
}

async function addRequestRow() {
  if (!selectedLocationId.value || !draftDay.value || !draftHour.value) return
  const dateHour = `${draftDay.value}T${draftHour.value}`
  const slot = allSlots.value.find((s) => s.dateHour === dateHour)
  if (!slot || slot.status !== ActivitySpotStatusEnum.AVAILABLE) {
    displayErrToast('Ce créneau n’est pas disponible.')
    return
  }

  try {
    await activityStore.addRequestedSpots(currentActivityId.value, selectedLocationId.value, [dateHour])
    displaySuccessToast('Demande ajoutée.')
    isAddingRow.value = false
  } catch (e) {
    displayErrToast('Erreur lors de l’ajout.')
    console.error(e)
  }
}

onMounted(async () => {
  if (!sessionStore.sessions || sessionStore.sessions.length === 0) {
    await sessionStore.getAllSessions()
  }
})
</script>
