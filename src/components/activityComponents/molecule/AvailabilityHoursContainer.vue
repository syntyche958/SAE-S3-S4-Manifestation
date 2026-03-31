<template>
  <div class="rounded-2xl border border-white/20 bg-zinc-800/70 p-4 shadow-inner shadow-black/20">
    <h3 class="mb-2 text-sm font-semibold tracking-wide text-white">{{ $t(sectionTitleKey) }}</h3>
    <div
      class="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-white/20 bg-zinc-700/60 px-3 py-2 text-xs text-white"
    >
      <span class="font-medium text-white/80">{{ $t('message.capsuleLegendTitle') }}</span>
      <template v-if="legendMode === 'admin'">
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.ADMIN_FREE" />
          {{ $t('message.adminCapsuleLegendFree') }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.ADMIN_PENDING" />
          {{ $t('message.adminCapsuleLegendPending') }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.ADMIN_RESERVED" />
          {{ $t('message.adminCapsuleLegendReserved') }}
        </span>
      </template>
      <template v-else>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.PROVIDER_FREE" />
          {{ $t('message.capsuleLegendFree') }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.PROVIDER_SELF" />
          {{ $t('message.capsuleLegendSelf') }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.PROVIDER_PENDING" />
          {{ $t('message.capsuleLegendPending') }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AvailabilityHourCapsule hour="10:00" :status="ActivitySpotStatusEnum.PROVIDER_OTHER" />
          {{ $t('message.capsuleLegendOther') }}
        </span>
      </template>
      <span class="w-full text-[11px] text-white/65">{{ $t(hintKey) }}</span>
    </div>
    <div class="max-h-60 overflow-auto rounded-xl border border-white/20 bg-zinc-800/55 p-3">
      <div v-for="day in availableDates" :key="day" class="mb-3 last:mb-0">
        <div
          class="mb-2 inline-flex rounded-md border border-white/20 bg-zinc-700/65 px-2 py-0.5 text-xs font-medium text-white/90"
        >
          {{ formatDate(day) }}
        </div>
        <div class="flex flex-wrap gap-2">
          <AvailabilityHourCapsule
            v-for="slot in slotsByDay[day] || []"
            :key="slot.dateHour"
            :hour="slot.hour"
            :status="slot.status"
            :selectable="isSlotSelectable(slot)"
            :selected="isSelected(slot.dateHour)"
            @toggle="emit('toggle-slot', slot.dateHour)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AvailabilityHourCapsule from '@/components/activityComponents/molecule/AvailabilityHourCapsule.vue'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'

const props = defineProps({
  availableDates: { type: Array, required: true },
  slotsByDay: { type: Object, required: true },
  selectedDateHours: { type: Array, required: true },
  sectionTitleKey: { type: String, default: 'message.availabilityHoursTitle' },
  hintKey: { type: String, default: 'message.capsuleSelectHint' },
  selectableStatuses: { type: Array, default: null },
  legendMode: {
    type: String,
    default: 'provider',
    validator: (v) => v === 'provider' || v === 'admin',
  },
})

const emit = defineEmits(['toggle-slot'])

function isSlotSelectable(slot) {
  if (props.selectableStatuses != null) {
    return props.selectableStatuses.includes(slot.status)
  }
  return slot.status === ActivitySpotStatusEnum.PROVIDER_FREE
}

function isSelected(dateHour) {
  return props.selectedDateHours.includes(dateHour)
}

function formatDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
