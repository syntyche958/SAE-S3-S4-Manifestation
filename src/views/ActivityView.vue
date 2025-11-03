<template>
  <!-- <div style="display: flex; gap: 20px">
    <div>
      <SideBarMenuActivity />
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-start; gap: 20px">
      <PresentationActivitySection />

      <DescriptionActivitySection />

      <div style="margin: auto">
        <h2>Emplacement de l'activité</h2>
        <TheMap :display-mode="MapModeEnum.VISITOR" />
      </div>
    </div>
  </div> -->

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
        </TabPanel>

        <TabPanel value="1">
          <TheMap />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
  <!-- Visitor -->
  <div v-else><h1>Presentation de l'activité</h1></div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

// import PresentationActivitySection from '@/components/activityComponents/PresentationActivitySection.vue'
// import SideBarMenuActivity from '@/components/activityComponents/SideBarMenuActivity.vue'
// import DescriptionActivitySection from '@/components/activityComponents/DescriptionActivitySection.vue'
import TheMap from '@/components/TheMap.vue'
// import { MapModeEnum } from '@/enums/Map.enums.js'
import { useProviderStore } from '@/stores/providers'

const authStore = useAuthStore()
const providerStore = useProviderStore()
const route = useRoute()
</script>
