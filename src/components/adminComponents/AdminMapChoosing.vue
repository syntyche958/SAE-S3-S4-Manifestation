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
        <ManuallySetActivityLocation
          :selectedLocation="selectedLocation"
          @set-activity-location="(activityId) => acceptActivityLocation(activityId)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { Card } from 'primevue'
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activities'
import { useLocationStore } from '@/stores/locations'
import LocationCharacteristics from '@/components/LocationCharacteristics.vue'
import WaitingLocationRequests from '@/components/adminComponents/WaitingLocationRequests.vue'
import ManuallySetActivityLocation from '@/components/adminComponents/ManuallySetActivityLocation.vue'

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['update-selected-location-id'])

const activityStore = useActivityStore()
const locationStore = useLocationStore()

const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id == props.selectedLocationId),
)

function acceptActivityLocation(activityId) {
  activityStore.updateLocationId(activityId, props.selectedLocationId)
  emit('update-selected-location-id', undefined)
}
</script>
