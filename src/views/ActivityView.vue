<template>
  <div
    v-if="
      authStore.user?.type === UserTypeEnum.VISITOR ||
      (authStore.user?.type === UserTypeEnum.PROVIDER &&
        route.params.provider_id != authStore.user?.id)
    "
  >
    <ActivityPresentation />
  </div>

  <div v-else>
    <Tabs value="0">
      <TabList>
        <Tab value="0"><i class="pi pi-file-edit"></i><span> Apparence de la page</span></Tab>
        <Tab value="1"><i class="pi pi-file-edit"></i><span> Choix de l'emplacement</span></Tab>
        <Tab value="2"><i class="pi pi-cog"></i><span> Configuration</span></Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <!-- TODO : Ajouter le nom de l'activité comme rappel visuel -->
          <ActivityPresentation />
        </TabPanel>
        <TabPanel value="1">
          <!-- TODO : Ajouter le nom de l'activité comme rappel visuel -->
          <ActivityMapChoosing />
        </TabPanel>
        <TabPanel value="2">
          <!-- TODO : Ajouter le nom de l'activité comme rappel visuel -->
          <ActivityConfiguration />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'
import ActivityPresentation from '@/components/providerComponents/ActivityPresentation.vue'
import ActivityConfiguration from '@/components/providerComponents/ActivityConfiguration.vue'
import ActivityMapChoosing from '@/components/providerComponents/ActivityMapChoosing.vue'

const authStore = useAuthStore()
const route = useRoute()
</script>
