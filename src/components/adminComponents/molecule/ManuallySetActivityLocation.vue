<template>
  <div class="mt-6 flex flex-col gap-4">
    <AvailabilityHoursContainer
      legend-mode="admin"
      :available-dates="EVENT_DAYS"
      :slots-by-day="slotsByDay"
      :selected-date-hours="selectedDateHours"
      :hint-key="'message.capsuleSelectHintAdmin'"
      :selectable-statuses="adminSelectableStatuses"
      @toggle-slot="toggleSlot"
    />

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div class="min-w-56 flex-1">
        <label class="mb-1 block text-xs font-medium text-white/70" for="manual-assign-activity">{{
          $t('message.activity')
        }}</label>
        <Select
          id="manual-assign-activity"
          v-model="selectedActivityId"
          :options="activitiesForAllSelectedSlots"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('message.manualAssignSelectActivity')"
          class="w-full md:max-w-md"
          :disabled="selectedDateHours.length === 0"
        />
      </div>
      <Button :label="$t('message.validate')" :disabled="!canSubmit" @click="submit" />
      <span v-if="selectedDateHours.length > 0" class="text-xs text-white/70">
        {{ $t('message.selectedSlotsCount', { n: selectedDateHours.length }) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Select, Button } from 'primevue'
import { useActivityStore } from '@/stores/activities'
import { useI18n } from 'vue-i18n'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'
import AvailabilityHoursContainer from '@/components/activityComponents/molecule/AvailabilityHoursContainer.vue'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'
import {
  buildAdminSlotsForLocation,
  getActivitiesAssignableToAllSlots,
} from '@/utils/locationSlots.utils'
import { displayErrToast } from '@/utils/toast.utils'

const activityStore = useActivityStore()
const { t } = useI18n()

const emit = defineEmits(['assign-spots-bulk'])

const props = defineProps({
  selectedLocation: { type: Object, required: true },
})

const adminSelectableStatuses = [
  ActivitySpotStatusEnum.ADMIN_FREE,
  ActivitySpotStatusEnum.ADMIN_PENDING,
]

const selectedDateHours = ref([])
const selectedActivityId = ref(null)

watch(
  () => props.selectedLocation?.id,
  () => {
    selectedDateHours.value = []
    selectedActivityId.value = null
  },
)

const allAdminSlots = computed(() =>
  buildAdminSlotsForLocation(
    activityStore.activities,
    props.selectedLocation.id,
    EVENT_DAYS,
    EVENT_START_HOUR,
    EVENT_END_HOUR,
  ),
)

watch(allAdminSlots, () => {
  selectedDateHours.value = selectedDateHours.value.filter((dh) => {
    const s = allAdminSlots.value.find((x) => x.dateHour === dh)
    return s && adminSelectableStatuses.includes(s.status)
  })
})

const slotsByDay = computed(() => {
  const grouped = {}
  for (const day of EVENT_DAYS) {
    grouped[day] = allAdminSlots.value.filter((s) => s.day === day)
  }
  return grouped
})

const activitiesForAllSelectedSlots = computed(() =>
  getActivitiesAssignableToAllSlots(
    activityStore.activities,
    props.selectedLocation.id,
    selectedDateHours.value,
  ),
)

watch(activitiesForAllSelectedSlots, (list) => {
  if (selectedActivityId.value != null && !list.some((a) => a.id === selectedActivityId.value)) {
    selectedActivityId.value = null
  }
})

const canSubmit = computed(
  () =>
    selectedDateHours.value.length > 0 &&
    selectedActivityId.value != null &&
    activitiesForAllSelectedSlots.value.some((a) => a.id === selectedActivityId.value),
)

function toggleSlot(dateHour) {
  const i = selectedDateHours.value.indexOf(dateHour)
  if (i >= 0) selectedDateHours.value.splice(i, 1)
  else selectedDateHours.value.push(dateHour)
}

function submit() {
  const dateHours = [...selectedDateHours.value]
  const allowed = getActivitiesAssignableToAllSlots(
    activityStore.activities,
    props.selectedLocation.id,
    dateHours,
  )
  if (!allowed.some((a) => a.id === selectedActivityId.value)) {
    displayErrToast(t('message.activityNotAssignableAllSlots'))
    return
  }
  emit('assign-spots-bulk', {
    activityId: selectedActivityId.value,
    dateHours,
  })
  selectedDateHours.value = []
  selectedActivityId.value = null
}
</script>
