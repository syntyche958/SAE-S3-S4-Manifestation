<template>
  <div>
    <h3 class="mb-2 text-sm font-semibold text-white/90">{{ $t(sectionTitleKey) }}</h3>
    <div
      class="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-white/85"
    >
      <span class="font-medium text-white/70">{{ $t('message.capsuleLegendTitle') }}</span>
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
      <span class="w-full text-[11px] text-white/55">{{ $t(hintKey) }}</span>
    </div>
    <div class="max-h-60 overflow-auto rounded-xl border border-white/10 p-3">
      <div v-for="day in availableDates" :key="day" class="mb-3 last:mb-0">
        <div class="mb-2 text-xs text-white/70">{{ formatDate(day) }}</div>
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
  /** Clé i18n pour le titre de section */
  sectionTitleKey: { type: String, default: 'message.availabilityHoursTitle' },
  hintKey: { type: String, default: 'message.capsuleSelectHint' },
  /**
   * Statuts cliquables (ex. admin : libre + demande en attente).
   * Si null, seul PROVIDER_FREE est sélectionnable (comportement prestataire).
   */
  selectableStatuses: { type: Array, default: null },
  /** Légende : 4 pastilles prestataire ou 3 pastilles admin (bleu / orange / vert). */
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
