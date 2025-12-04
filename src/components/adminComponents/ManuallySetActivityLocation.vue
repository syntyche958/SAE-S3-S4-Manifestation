<template>
  <h2>Choisir manuellement :</h2>
  <Select
    v-model="selectedActivity"
    :options="filteredActivities"
    optionLabel="name"
    placeholder="Select an activity"
    class="w-full md:w-56"
  />
  <Button
    type="button"
    label="Enregistrer"
    icon="pi pi-save"
    @click="setActivityLocation"
    :disabled="selectedActivity == undefined"
  />
</template>

<script setup>
import { useActivityStore } from '@/stores/activities'
import { Button, Select } from 'primevue'
import { computed, ref } from 'vue'

const activityStore = useActivityStore()

const emit = defineEmits(['set-activity-location'])

const selectedActivity = ref()
const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)
const setActivityLocation = () => {
  emit('set-activity-location', selectedActivity.value.id)
}
</script>
