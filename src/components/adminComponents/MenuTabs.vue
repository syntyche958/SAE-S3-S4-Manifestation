<template>
  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0"><i class="pi pi-file-edit"></i><span>Gérer la manifestation</span></Tab>
        <Tab value="1"><i class="pi pi-map"></i><span>Carte interactive</span></Tab>
        <Tab value="2"><i class="pi pi-users"></i><span>Gerer les prestataires</span></Tab>
        <Tab value="3"><i class="pi pi-home"></i><span>Espace Prestataire</span></Tab>
        <Tab value="4"><i class="pi pi-chart-bar"></i><span>Statistiques</span></Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <EventEditor />
        </TabPanel>

        <TabPanel value="1">
          <h1>Carte interactive</h1>
          <TheMap :displayMode="MapMode.ADMIN" />
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
  </div>
</template>

<script setup>
import EventEditor from './EventEditor.vue';
import TheMap from '../TheMap.vue';
import { MapMode } from '@/enums/Map.enums';
import AdminStats from './AdminStats.vue';
import ManageProviders from './ManageNewProviders.vue';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
</script>
