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
          :options="enrichedActivitiesForAllSelectedSlots"
          optionValue="id"
          :placeholder="$t('message.manualAssignSelectActivity')"
          class="w-full md:max-w-md"
          :disabled="selectedDateHours.length === 0"
        >
          <template #option="slotProps">
            <span>
              {{ slotProps.option.name }}
              <span v-if="slotProps.option.isRequester" class="ml-1 text-amber-300">(demande)</span>
            </span>
          </template>
          <template #value="slotProps">
            <span v-if="slotProps.value">
              {{
                enrichedActivitiesForAllSelectedSlots.find((a) => a.id === slotProps.value)?.name
              }}
              <span
                v-if="
                  enrichedActivitiesForAllSelectedSlots.find((a) => a.id === slotProps.value)
                    ?.isRequester
                "
                class="ml-1 text-amber-300"
              >
                (demande)
              </span>
            </span>
          </template>
        </Select>
      </div>
      <Button :label="buttonLabel" :disabled="!canSubmit" @click="submit" />
      <Button
        v-if="showRefuseButton"
        :label="$t('message.refusePlacementRequest')"
        severity="danger"
        @click="refusePending"
      />
      <span v-if="selectedDateHours.length > 0" class="text-xs text-white/70">
        {{ $t('message.selectedSlotsCount', { n: selectedDateHours.length }) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Select, Button } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { useActivityStore } from '@/stores/activities'
import { useI18n } from 'vue-i18n'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'
import AvailabilityHoursContainer from '@/components/activityComponents/molecule/AvailabilityHoursContainer.vue'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'
import {
  buildAdminSlotsForLocation,
  getActivitiesAssignableToAllSlots,
  getActivityRequestingSlot,
  getActivityWithConfirmedSlot,
} from '@/utils/locationSlots.utils'
import { displayErrToast } from '@/utils/toast.utils'

const activityStore = useActivityStore()
const { t } = useI18n()
const confirm = useConfirm()

const emit = defineEmits(['assign-spots-bulk'])

const props = defineProps({
  selectedLocation: { type: Object, required: true },
})

const adminSelectableStatuses = new Set([
  ActivitySpotStatusEnum.ADMIN_FREE,
  ActivitySpotStatusEnum.ADMIN_PENDING,
  ActivitySpotStatusEnum.ADMIN_RESERVED,
])

const selectedDateHours = ref([])
const selectedActivityId = ref(null)
const validatingRequestActivityId = ref(null)

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
    return s && adminSelectableStatuses.has(s.status)
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

const enrichedActivitiesForAllSelectedSlots = computed(() => {
  if (selectedDateHours.value.length === 1) {
    const requestingActivity = getActivityRequestingSlot(
      activityStore.activities,
      props.selectedLocation.id,
      selectedDateHours.value[0],
    )
    return activitiesForAllSelectedSlots.value.map((a) => ({
      ...a,
      isRequester: requestingActivity && requestingActivity.id === a.id,
    }))
  }
  return activitiesForAllSelectedSlots.value.map((a) => ({ ...a, isRequester: false }))
})

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

const isValidatingRequest = computed(() => {
  if (selectedDateHours.value.length !== 1) return false
  const slot = allAdminSlots.value.find((s) => s.dateHour === selectedDateHours.value[0])
  return slot && slot.status === ActivitySpotStatusEnum.ADMIN_PENDING
})

const isReassigning = computed(() => {
  if (selectedDateHours.value.length !== 1) return false
  const slot = allAdminSlots.value.find((s) => s.dateHour === selectedDateHours.value[0])
  return slot && slot.status === ActivitySpotStatusEnum.ADMIN_RESERVED
})

const refuseSelectionState = computed(() => {
  const dhs = selectedDateHours.value
  if (dhs.length === 0) return { canRefuse: false, activityId: null }
  let activityId = null
  for (const dh of dhs) {
    const slot = allAdminSlots.value.find((s) => s.dateHour === dh)
    if (!slot || slot.status !== ActivitySpotStatusEnum.ADMIN_PENDING) {
      return { canRefuse: false, activityId: null }
    }
    const act = getActivityRequestingSlot(
      activityStore.activities,
      props.selectedLocation.id,
      dh,
    )
    if (!act) return { canRefuse: false, activityId: null }
    if (activityId === null) activityId = act.id
    else if (act.id !== activityId) return { canRefuse: false, activityId: null }
  }
  return { canRefuse: true, activityId }
})

const showRefuseButton = computed(
  () =>
    refuseSelectionState.value.canRefuse &&
    refuseSelectionState.value.activityId != null &&
    selectedActivityId.value === refuseSelectionState.value.activityId,
)

const buttonLabel = computed(() => {
  if (isValidatingRequest.value) return t('message.validate')
  if (isReassigning.value) return t('message.reassignSpot')
  return t('message.validate')
})

function toggleSlot(dateHour) {
  const i = selectedDateHours.value.indexOf(dateHour)

  if (i >= 0) {
    selectedDateHours.value.splice(i, 1)
    if (selectedDateHours.value.length === 0) {
      validatingRequestActivityId.value = null
      selectedActivityId.value = null
    }
  } else {
    const slot = allAdminSlots.value.find((s) => s.dateHour === dateHour)
    selectedDateHours.value.push(dateHour)

    if (slot && slot.status === ActivitySpotStatusEnum.ADMIN_PENDING) {
      const requestingActivity = getActivityRequestingSlot(
        activityStore.activities,
        props.selectedLocation.id,
        dateHour,
      )
      if (requestingActivity) {
        selectedActivityId.value = requestingActivity.id
        validatingRequestActivityId.value = requestingActivity.id
      }
    } else if (slot && slot.status === ActivitySpotStatusEnum.ADMIN_RESERVED) {
      const currentActivity = getActivityWithConfirmedSlot(
        activityStore.activities,
        props.selectedLocation.id,
        dateHour,
      )
      if (currentActivity) {
        selectedActivityId.value = currentActivity.id
        validatingRequestActivityId.value = null
      }
    }
  }
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

function refusePending() {
  const { activityId } = refuseSelectionState.value
  const locationId = props.selectedLocation.id
  const dateHours = [...selectedDateHours.value]
  if (activityId == null) return
  confirm.require({
    group: 'admin',
    message: t('message.refusePlacementConfirm'),
    header: t('message.refusePlacementConfirmHeader'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('message.cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('message.refusePlacementRequest'),
      severity: 'danger',
    },
    accept: async () => {
      await activityStore.refuseRequestedLocation(activityId, locationId, dateHours, undefined)
      selectedDateHours.value = []
      selectedActivityId.value = null
      validatingRequestActivityId.value = null
    },
  })
}
</script>
