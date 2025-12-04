<template>
  <div class="mt-6 flex flex-col gap-3">
    <h2 class="mb-0!">Choisir manuellement :</h2>
    <Message v-if="alreadySetActivity" severity="warn"
      >Cet emplacement est déjà assigné à l'activité : <b>{{ alreadySetActivity.name }}</b></Message
    >
    <Select
      v-model="selectedActivity"
      :options="filteredActivities"
      optionLabel="name"
      placeholder="Select an activity"
      class="w-full md:w-56"
    />
    <Button
      type="button"
      :label="alreadySetActivity ? 'Modifier' : 'Enregistrer'"
      icon="pi pi-save"
      @click="setActivityLocation"
      :disabled="selectedActivity == undefined"
      class="w-fit"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Button, Select, Message } from 'primevue'
import { useActivityStore } from '@/stores/activities'

const activityStore = useActivityStore()

const emit = defineEmits(['set-activity-location'])
const props = defineProps({
  selectedLocation: { required: true },
})

const selectedActivity = ref()
const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)
const alreadySetActivity = computed(() =>
  activityStore.activities.find((a) => a.locationId === props.selectedLocation.id),
)

const setActivityLocation = () => {
  emit('set-activity-location', selectedActivity.value.id)
}
</script>
