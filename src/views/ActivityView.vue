<template>
  <div v-if="isProviderAdminPanelToHide()">
    <ActivityPresentation />
  </div>

  <div v-else class="flex justify-center">
    <Card class="w-[95%] mt-[1vh] min-h-[80vh] z-0">
      <template #content>
        <Tabs value="0">
          <!-- TODO : Mettre dans le main css le margin rigth pour toutes les Tab entre icon et texte (avec une classe !? ou faire plus automatique ?) -->
          <TabList>
            <Tab value="0"
              ><i class="pi pi-file-edit"></i
              ><span>{{ $t('message.appearanceOfThePage') }}</span></Tab
            >
            <Tab value="1"
              ><i class="pi pi-file-edit"></i><span>{{ $t('message.choiceOfLocation') }}</span></Tab
            >
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
          </TabPanels> </Tabs
      ></template>
    </Card>
  </div>
</template>

<script setup>
import { Card, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue'
import ActivityPresentation from '@/components/providerComponents/ActivityPresentation.vue'
import ActivityConfiguration from '@/components/providerComponents/ActivityConfiguration.vue'
import ActivityMapChoosing from '@/components/providerComponents/ActivityMapChoosing.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
</script>
