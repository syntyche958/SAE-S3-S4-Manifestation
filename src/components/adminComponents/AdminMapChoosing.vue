<template>
  <Card class="w-full">
    <template #content>
      <h1 v-if="selectedLocationId == undefined">Aucun emplacement séléctionné</h1>

      <div v-else>
        <h1>Emplacement {{ selectedLocationId }} séléctionné</h1>
        <LocationCharacteristics :selectedLocation="selectedLocation" :displayTitle="true" />
        <WaitingLocationRequests
          :selectedLocationId="selectedLocationId"
          @set-activity-location="(activityId) => acceptActivityLocation(activityId)"
        />
        <!-- TODO : Refactor dans un composant -->
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
      </div>
    </template>
  </Card>
</template>

<script setup>
// TODO : Si emplacement déjà assigner => modifier = enlever l'assignation precedante d'abord !
import { useActivityStore } from '@/stores/activities'
import { useLocationStore } from '@/stores/locations'
import { Button, Card, Select } from 'primevue'
import { computed, ref } from 'vue'
import LocationCharacteristics from '../LocationCharacteristics.vue'
import WaitingLocationRequests from './WaitingLocationRequests.vue'

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['update-selected-location-id'])

const selectedActivity = ref()
// TODO : Reset selectedActivity value when onmap selected location changes !
const activityStore = useActivityStore()
const locationStore = useLocationStore()

const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id == props.selectedLocationId),
)

const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)

const setActivityLocation = () => {
  acceptActivityLocation(selectedActivity.value.id)
}

function acceptActivityLocation(activityId) {
  activityStore.updateLocationId(activityId, props.selectedLocationId)
  emit('update-selected-location-id', undefined)
  selectedActivity.value = undefined
}
</script>
