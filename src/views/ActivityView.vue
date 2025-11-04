<template>
  <!-- Provider(owner) / Admin -->
  <div
    v-if="
      Number.parseInt(route.params.provider_id) ===
      providerStore.providers.find((p) => p.userId === authStore.user?.id).id
    "
  >
    <Tabs value="0">
      <TabList>
        <Tab value="0"><i class="pi pi-file-edit"></i><span> Apparence de la page</span></Tab>
        <Tab value="1"><i class="pi pi-file-edit"></i><span> Choix de l'emplacement</span></Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <h1>Presentation de l'activité</h1>
          <h1>S'inscrire</h1>
        </TabPanel>

        <TabPanel value="1">
          <TheMap :display-mode="MapModeEnum.VISITOR" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <!-- Visitor -->
  <div v-else>
    <h1>Presentation de l'activité</h1>
    <h1>S'inscrire</h1>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import TheMap from '@/components/TheMap.vue'
import { useProviderStore } from '@/stores/providers'
import { MapModeEnum } from '@/enums/Map.enums'

const authStore = useAuthStore()
const providerStore = useProviderStore()
const route = useRoute()
</script>
