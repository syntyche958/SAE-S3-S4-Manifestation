<template>
  <div class="mb-3 grid gap-2 md:grid-cols-3">
    <div>
      <label class="mb-1 block text-xs font-medium text-white/75">Jour</label>
      <Select
        :modelValue="selectedDay"
        :options="dayOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        @update:modelValue="(value) => emit('update:selectedDay', value)"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-white/75">Heure</label>
      <Select
        :modelValue="selectedHour"
        :options="hourOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        @update:modelValue="(value) => emit('update:selectedHour', value)"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-white/75">Activite</label>
      <Select
        :modelValue="selectedActivityId"
        :options="activityOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        @update:modelValue="(value) => emit('update:selectedActivityId', value)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Select } from 'primevue'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'
import { useActivityStore } from '@/stores/activities'

const activityStore = useActivityStore()

defineProps({
  selectedDay: { type: String, required: true },
  selectedHour: { type: String, required: true },
  selectedActivityId: { type: [String, Number, null], required: true },
})

const emit = defineEmits([
  'update:selectedDay',
  'update:selectedHour',
  'update:selectedActivityId',
])

const availableHours = computed(() =>
  Array.from(
    { length: EVENT_END_HOUR - EVENT_START_HOUR + 1 },
    (_, index) => `${String(EVENT_START_HOUR + index).padStart(2, '0')}:00`,
  ),
)

const dayOptions = computed(() =>
  EVENT_DAYS.map((day) => ({
    label: formatDate(day),
    value: day,
  })),
)

const hourOptions = computed(() =>
  availableHours.value.map((hour) => ({
    label: hour,
    value: hour,
  })),
)

const allActivities = computed(() =>
  activityStore.activities.slice().sort((a, b) => a.name.localeCompare(b.name)),
)

const activityOptions = computed(() => [
  { label: 'Tout', value: null },
  ...allActivities.value.map((activity) => ({
    label: activity.name,
    value: activity.id,
  })),
])

function formatDate(dateStr) {
  const [year, month, day] = String(dateStr).split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
