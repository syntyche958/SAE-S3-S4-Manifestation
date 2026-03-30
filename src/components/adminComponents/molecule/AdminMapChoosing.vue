<template>
  <Card class="w-full">
    <template #content>
      <h1 v-if="selectedLocationId == undefined">{{ $t('message.noLocationSelected') }}</h1>

      <div v-else>
        <h1>{{ $t('message.selectedLocation', { id: selectedLocationId }) }}</h1>
        <LocationCharacteristics :selectedLocation="selectedLocation" :displayTitle="true" />
        <Tabs value="0" class="mt-4">
          <TabList>
            <Tab value="0"><i class="pi pi-clock mr-2"></i>Demandes en attente</Tab>
            <Tab value="1"><i class="pi pi-pencil mr-2"></i>Attribution manuelle</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <WaitingLocationRequests
                :selectedLocationId="selectedLocationId"
                @set-activity-location="(spotData) => acceptActivityLocation(spotData)"
              />
            </TabPanel>
            <TabPanel value="1">
              <ManuallySetActivityLocation
                :selectedLocation="selectedLocation"
                @set-activity-location="(spotData) => acceptActivityLocation(spotData)"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { Card, Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue'
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activities'
import { useLocationStore } from '@/stores/locations'
import LocationCharacteristics from '@/components/globalComponents/molecule/LocationCharacteristics.vue'
import WaitingLocationRequests from '@/components/adminComponents/molecule/WaitingLocationRequests.vue'
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

function acceptActivityLocation({ activityId, dateHour }) {
  activityStore.addSpot(activityId, props.selectedLocationId, dateHour)
  //emit('update-selected-location-id', undefined)
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
