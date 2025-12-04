<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0"
        ><i class="pi pi-file-edit mr-2"></i
        ><span>{{ $t('message.administerTheEvent') }}</span></Tab
      >
      <Tab value="1"
        ><i class="pi pi-map mr-2"></i><span>{{ $t('message.interactiveMap') }}</span></Tab
      >
      <Tab value="2"
        ><i class="pi pi-users mr-2"></i
        ><span>{{ $t('message.manageProviderRequests') }}</span></Tab
      >
      <Tab value="3"
        ><i class="pi pi-home mr-2"></i><span>{{ $t('message.providerDashboard') }}</span></Tab
      >
      <Tab value="4"
        ><i class="pi pi-chart-bar mr-2"></i><span>{{ $t('message.statistics') }}</span></Tab
      >
    </TabList>

    <TabPanels>
      <TabPanel value="0">
        <EventEditor />
      </TabPanel>

      <TabPanel value="1">
        <h1>{{ $t('message.interactiveMap') }}</h1>
        <div class="flex gap-2.5">
          <TheMap
            :displayMode="MapModeEnum.ADMIN"
            @change-selected-location="
              (sl) => {
                selectedLocationId = sl
              }
            "
            class="w-fit"
          />
          <AdminMapChoosing
            :selectedLocationId="selectedLocationId"
            @update-selected-location-id="(value) => (selectedLocationId = value)"
          />
        </div>
      </TabPanel>

      <TabPanel value="2">
        <ManageProviders />
      </TabPanel>

      <TabPanel value="3">
        <h1>{{ $t('message.providerDashboard') }}</h1>
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
import { ref } from 'vue'
import AdminMapChoosing from './AdminMapChoosing.vue'

const selectedLocationId = ref()
</script>
