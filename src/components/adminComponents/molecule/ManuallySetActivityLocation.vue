<template>
  <div class="mt-6 flex flex-col gap-3">
    <h2 class="mb-0!">{{ $t('message.manuallyChoose') + ' :' }}</h2>
    <Message severity="info">Sélectionnez une activité pour chaque heure.</Message>

    <DataTable :value="timeSlots" dataKey="slotKey" paginator :rows="8">
      <Column field="beginingDate" header="Date" sortable />
      <Column field="beginingHour" header="Heure" sortable />
      <Column header="Activité">
        <template #body="{ data }">
          <Select
            v-model="manualAssignments[data.slotKey]"
            :options="getAvailableActivitiesForSlot(data.slotKey)"
            optionLabel="name"
            optionValue="id"
            placeholder="Choisir une activité"
            class="w-full md:w-72"
          />
        </template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <Button
            icon="pi pi-save"
            size="small"
            :disabled="!manualAssignments[data.slotKey]"
            @click="setActivityLocation(data.slotKey, manualAssignments[data.slotKey])"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Select, Message, DataTable, Column, Button } from 'primevue'
import { useActivityStore } from '@/stores/activities'
import { useI18n } from 'vue-i18n'

useI18n()
const activityStore = useActivityStore()

const emit = defineEmits(['set-activity-location'])

const props = defineProps({
  selectedLocation: { required: true },
})

const manualAssignments = ref({})

watch(
  () => [props.selectedLocation, activityStore.activities],
  () => {
    const assignments = {}
    if (!props.selectedLocation) return
    for (const activity of activityStore.activities) {
      for (const spot of activity.spotIds || []) {
        if (spot.locationId === props.selectedLocation.id) {
          assignments[spot.dateHour] = activity.id
        }
      }
    }
    manualAssignments.value = assignments
  },
  { immediate: true, deep: true },
)

const eventDays = ['2026-05-28', '2026-05-29'] // TODO Déplacer dans un globalVar si utilisé ailleur
const startHour = 8
const endHour = 23

const timeSlots = computed(() => {
  const slots = []
  for (const day of eventDays) {
    for (let h = startHour; h <= endHour; h++) {
      const hour = `${String(h).padStart(2, '0')}:00`
      slots.push({
        slotKey: `${day}T${hour}`,
        beginingDate: day,
        beginingHour: hour,
      })
    }
  }
  return slots
})

function getActivitiesTakenAtSlot(slotKey) {
  const taken = new Set()
  for (const activity of activityStore.activities) {
    for (const spot of activity.spotIds || []) {
      if (spot.dateHour === slotKey && spot.locationId !== props.selectedLocation.id) {
        taken.add(activity.id)
      }
    }
  }
  return taken
}

function getAvailableActivitiesForSlot(slotKey) {
  const taken = getActivitiesTakenAtSlot(slotKey)
  return activityStore.activities
    .filter((a) => !taken.has(a.id))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const setActivityLocation = (slotKey, activityId) => {
  emit('set-activity-location', { activityId, dateHour: slotKey })
}
</script>
