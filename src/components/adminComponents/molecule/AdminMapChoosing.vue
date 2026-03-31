<template>
  <Card class="w-full">
    <template #content>
      <h1 v-if="selectedLocationId == undefined">{{ $t('message.noLocationSelected') }}</h1>

      <div v-else>
        <h1>{{ $t('message.selectedLocation', { id: selectedLocationId }) }}</h1>
        <LocationCharacteristics :selectedLocation="selectedLocation" :displayTitle="true" />
        <ManuallySetActivityLocation
          :selectedLocation="selectedLocation"
          @assign-spots-bulk="acceptSpotsBulk"
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
import LocationCharacteristics from '@/components/globalComponents/molecule/LocationCharacteristics.vue'
import ManuallySetActivityLocation from '@/components/adminComponents/molecule/ManuallySetActivityLocation.vue'

const props = defineProps({
  selectedLocationId: { type: Number },
})

//const emit = defineEmits(['update-selected-location-id'])

const activityStore = useActivityStore()
const locationStore = useLocationStore()

const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id == props.selectedLocationId),
)

function acceptSpotsBulk({ activityId, dateHours }) {
  activityStore.addSpotsBulk(activityId, props.selectedLocationId, dateHours)
}

async function refuseActivityLocation(activityId) {
  const confirmed = window.confirm('Refuser cette demande de placement ?')
  if (!confirmed) {
    return
  }

  const reason = window.prompt('Motif du refus (facultatif)')?.trim()
  await activityStore.refuseRequestedLocation(activityId, reason || undefined)
  emit('update-selected-location-id', undefined)
}
</script>

<style scoped>
:deep(.p-tab) {
  color: #fafafa !important;
}

:deep(.p-tab-active i) {
  color: #059669 !important;
}
</style>
