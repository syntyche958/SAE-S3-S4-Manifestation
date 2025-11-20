<template>
  <Card class="w-full">
    <!-- <template #title>Simple Card</template> -->
    <template #content>
      <Tabs value="0">
        <TabList>
          <Tab value="0"><i class="pi pi-file-edit"></i><span>Assigner manuellement</span></Tab>
          <Tab value="0=1"
            ><i class="pi pi-file-edit"></i><span>Demande des prestataires</span></Tab
          >
        </TabList>
        <TabPanels
          ><TabPanel value="0">
            <div v-if="selectedLocationId == undefined">Aucun emplacement séléctionné</div>
            <div v-else>
              <div>Emplacement {{ selectedLocationId }} séléctionné</div>
              <!-- TODO : Afficher les caracteritiques de l'emplacement (de facon sommaire) -->
              <div class="card flex justify-center">
                <Select
                  v-model="selectedActivity"
                  :options="filteredActivities"
                  optionLabel="name"
                  placeholder="Select an activity"
                  class="w-full md:w-56"
                />
              </div>
              <Button
                type="button"
                label="Enregistrer"
                icon="pi pi-save"
                @click="setActivityLocation"
                :disabled="selectedActivity == undefined"
              /></div
          ></TabPanel>
          <TabPanel>
            <div>TODO</div>
          </TabPanel>
        </TabPanels></Tabs
      >
    </template>
  </Card>
</template>
<script setup>
import { useActivityStore } from '@/stores/activities'
import { Button, Card, Select, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue'
import { computed, ref } from 'vue'

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['update-selected-location-id'])

const selectedActivity = ref()
const activityStore = useActivityStore()

const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)
const setActivityLocation = () => {
  activityStore.updateLocationId(selectedActivity.value.id, props.selectedLocationId)
  emit('update-selected-location-id', undefined)
  selectedActivity.value = undefined
}
</script>
