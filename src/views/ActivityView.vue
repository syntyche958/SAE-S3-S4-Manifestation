<template>
  <div
    v-if="
      authStore.user?.type === UserTypeEnum.VISITOR ||
      (authStore.user?.type === UserTypeEnum.PROVIDER &&
        route.params.provider_id != authStore.user?.id)
    "
  >
    <div v-if="currentActivity">
      <div v-html="currentActivity.name"></div>
      <div v-html="currentActivity.presentationContent"></div>
      <div style="margin-top: 1rem">
        <Button label="S'inscrire" icon="pi pi-user-plus" />
      </div>
    </div>
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
          <div v-if="currentActivity">
            <div v-html="currentActivity.name"></div>
            <div v-html="currentActivity.presentationContent"></div>
            <div style="margin-top: 1rem">
              <Button label="S'inscrire" icon="pi pi-user-plus" />
            </div>
          </div>
        </TabPanel>

        <TabPanel value="1">
          <TheMap :display-mode="MapModeEnum.VISITOR" />
        </TabPanel>

        <TabPanel value="2">
          <div>
            <h2>Configuration de l'activité</h2>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'

import TheMap from '@/components/TheMap.vue'
import { useActivityStore } from '@/stores/activities'
import { MapModeEnum } from '@/enums/Map.enums'

const authStore = useAuthStore()
const activityStore = useActivityStore()
const route = useRoute()

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((a) => a.id === activityId)
})
</script>
