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
          <AvailabilityHoursContainer
            :available-dates="availableDates"
            :slots-by-day="slotsByDay"
            :selected-date-hours="selectedDateHours"
            @toggle-slot="toggleSlotSelection"
          />
          <div class="flex flex-wrap items-center gap-3">
            <Button
              :label="$t('message.demandSpotButton')"
              :disabled="selectedDateHours.length === 0"
              @click="submitSelectedRequests"
            />
            <span v-if="selectedDateHours.length > 0" class="text-xs text-white/70">
              {{ $t('message.selectedSlotsCount', { n: selectedDateHours.length }) }}
            </span>
          </div>
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
import { Button, Card } from 'primevue'
import { MapModeEnum } from '@/enums/Map.enums'
import TheMap from '@/components/globalComponents/molecule/TheMap.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocationCharacteristics from '@/components/globalComponents/molecule/LocationCharacteristics.vue'
import AvailabilityHoursContainer from '@/components/activityComponents/molecule/AvailabilityHoursContainer.vue'
import { useSessionStore } from '@/stores/sessions'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'
import { buildProviderSlots } from '@/utils/locationSlots.utils'

const locationStore = useLocationStore()
const activityStore = useActivityStore()
const route = useRoute()
const sessionStore = useSessionStore()
const { t } = useI18n()

const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)
const onChangeSelectedLocation = (locationId) => {
  selectedLocationId.value = locationId
}

const currentActivityId = computed(() => Number(route.params.activity_id))
const currentActivity = computed(() => activityStore.get(currentActivityId.value))

/** Créneaux sélectionnés pour demande (clés `YYYY-MM-DDTHH:00`) */
const selectedDateHours = ref([])

watch(selectedLocationId, () => {
  selectedDateHours.value = []
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

const allSlots = computed(() =>
  buildProviderSlots(
    availableDates.value,
    selectedLocationId.value,
    currentActivityId.value,
    activityStore.activities,
    currentActivity.value,
    EVENT_START_HOUR,
    EVENT_END_HOUR,
  ),
)

watch(allSlots, () => {
  selectedDateHours.value = selectedDateHours.value.filter((dh) => {
    const s = allSlots.value.find((x) => x.dateHour === dh)
    return s?.status === ActivitySpotStatusEnum.PROVIDER_FREE
  })
})

const slotsByDay = computed(() => {
  const grouped = {}
  for (const day of availableDates.value) {
    grouped[day] = allSlots.value.filter((s) => s.day === day)
  }
  return grouped
})

function toggleSlotSelection(dateHour) {
  const i = selectedDateHours.value.indexOf(dateHour)
  if (i >= 0) selectedDateHours.value.splice(i, 1)
  else selectedDateHours.value.push(dateHour)
}

async function submitSelectedRequests() {
  if (!selectedLocationId.value || selectedDateHours.value.length === 0) return

  const dateHours = selectedDateHours.value.filter((dh) => {
    const s = allSlots.value.find((x) => x.dateHour === dh)
    return s?.status === ActivitySpotStatusEnum.PROVIDER_FREE
  })
  if (dateHours.length === 0) {
    displayErrToast(t('message.noValidSlotsInSelection'))
    return
  }

  try {
    await activityStore.addRequestedSpots(currentActivityId.value, selectedLocationId.value, dateHours)
    displaySuccessToast(
      dateHours.length > 1
        ? t('message.requestsSavedMany', { n: dateHours.length })
        : t('message.requestsSavedOne'),
    )
    selectedDateHours.value = []
  } catch (e) {
    displayErrToast(t('message.requestsSaveError'))
    console.error(e)
  }
}

onMounted(async () => {
  if (!sessionStore.sessions || sessionStore.sessions.length === 0) {
    await sessionStore.getAllSessions()
  }
})
</script>
