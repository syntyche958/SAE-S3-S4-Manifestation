<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0"><i class="pi pi-file-edit"></i><span> Gérer la manifestation</span></Tab>
      <Tab value="1"><i class="pi pi-map"></i><span> Carte interactive</span></Tab>
      <Tab value="2"
        ><i class="pi pi-users"></i><span> Gerer les demandes de prestataires</span></Tab
      >
      <Tab value="3"><i class="pi pi-home"></i><span> Espace Prestataire</span></Tab>
      <Tab value="4"><i class="pi pi-chart-bar"></i><span> Statistiques</span></Tab>
    </TabList>

    <TabPanels>
      <TabPanel value="0">
        <EventEditor />
      </TabPanel>

      <TabPanel value="1">
        <h1>Carte interactive</h1>
        <div class="flex">
          <TheMap
            :displayMode="MapModeEnum.ADMIN"
            @change-selected-location="
              (sl) => {
                selectedLocationId = sl
              }
            "
            class="w-fit"
          />
          <div v-if="selectedLocationId == undefined">Aucun emplacement séléctionné</div>
          <div v-else>
            <div>Emplacement {{ selectedLocationId }} séléctionné</div>
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
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel value="2">
        <ManageProviders />
      </TabPanel>

      <TabPanel value="3">
        <h1>Espace prestaire</h1>
      </TabPanel>

      <TabPanel value="4">
        <AdminStats />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup>
import EventEditor from './EventEditor.vue'
import TheMap from '../TheMap.vue'
import { MapModeEnum } from '@/enums/Map.enums'
import AdminStats from './AdminStats.vue'
import ManageProviders from './ManageNewProviders.vue'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { computed, ref } from 'vue'
import { useActivityStore } from '@/stores/activities'
import { Button, Select } from 'primevue'

const selectedLocationId = ref()
const selectedActivity = ref()
const activityStore = useActivityStore()

const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)

const setActivityLocation = () => {
  activityStore.updateLocationId(selectedActivity.value.id, selectedLocationId.value)
  selectedLocationId.value = undefined
  selectedActivity.value = undefined
}
</script>
