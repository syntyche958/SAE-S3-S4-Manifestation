<template>
  <div>
    <h3 class="mb-2 text-sm font-semibold text-white/90">Disponibilités (toutes heures)</h3>
    <div class="max-h-60 overflow-auto rounded-xl border border-white/10 p-3">
      <div v-for="day in availableDates" :key="day" class="mb-3 last:mb-0">
        <div class="mb-2 text-xs text-white/70">{{ formatDate(day) }}</div>
        <div class="flex flex-wrap gap-2">
          <AvailabilityHourCapsule
            v-for="slot in slotsByDay[day] || []"
            :key="slot.dateHour"
            :hour="slot.hour"
            :status="slot.status"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AvailabilityHourCapsule from '@/components/activityComponents/molecule/AvailabilityHourCapsule.vue'

defineProps({
  availableDates: { type: Array, required: true },
  slotsByDay: { type: Object, required: true },
})

function formatDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
