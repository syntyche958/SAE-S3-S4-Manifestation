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
            :options="availableActivities"
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
import { computed, ref } from 'vue'
import { Select, Message, DataTable, Column, Button } from 'primevue'
import { useActivityStore } from '@/stores/activities'
import { useI18n } from 'vue-i18n'

useI18n()
const activityStore = useActivityStore()

const emit = defineEmits(['set-activity-location'])

defineProps({
  selectedLocation: { required: true },
})

const manualAssignments = ref({})

const eventDays = ['2026-05-28', '2026-05-29'] // TODO Déplacer
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

const availableActivities = computed(() =>
  [...activityStore.activities].sort((a, b) => a.name.localeCompare(b.name)),
)

const setActivityLocation = (slotKey, activityId) => {
  emit('set-activity-location', { activityId, dateHour: slotKey })
}
</script>
