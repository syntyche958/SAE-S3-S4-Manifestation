<template>
  <Tabs value="0">
    <!-- TODO : Mettre dans le main css le margin rigth pour toutes les Tab entre icon et texte (avec une classe !? ou faire plus automatique ?) -->
    <TabList>
      <Tab value="0"
        ><i class="pi pi-file-edit"></i><span>{{ $t('message.appearanceOfThePage') }}</span></Tab
      >
      <Tab value="1"
        ><i class="pi pi-file-edit"></i><span>{{ $t('message.choiceOfLocation') }}</span></Tab
      >
      <Tab value="2"><i class="pi pi-cog"></i><span> Configuration</span></Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <ActivityPresentation />
      </TabPanel>
      <TabPanel value="1">
        <ActivityMapChoosing />
      </TabPanel>
      <TabPanel value="2">
        <ActivityConfiguration />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup>
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue'
import ActivityPresentation from '@/components/providerComponents/ActivityPresentation.vue'
import ActivityConfiguration from '@/components/providerComponents/ActivityConfiguration.vue'
import ActivityMapChoosing from '@/components/providerComponents/ActivityMapChoosing.vue'
</script>
