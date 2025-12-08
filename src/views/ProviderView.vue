<template>
  <!-- <BreadcrumbNav /> -->
  <!-- Visitor -->
  <div v-if="isProviderAdminPanelToHide()" class="flex justify-center">
    <Card class="main-section-container"
      ><template #content>
        <h1 class="text-center texturina-title">
          {{ providerStore.get(Number($route.params.provider_id)).name }}
        </h1>
        <PresentationProviderSection
      /></template>
    </Card>
  </div>

  <!-- Provider / Admin -->
  <div v-else class="flex justify-center">
    <Card class="main-section-container">
      <template #content
        ><h1 class="text-center">
          {{ providerStore.get(Number($route.params.provider_id)).name }}
        </h1>
        <Tabs value="0">
          <TabList>
            <Tab value="0"
              ><i class="pi pi-file-edit"></i
              ><span>{{ $t('message.appearanceOfThePage') }}</span></Tab
            >
            <Tab value="1"
              ><i class="pi pi-file-edit"></i><span>{{ $t('message.chooseServices') }}</span></Tab
            >
            <Tab disabled
              ><i class="pi pi-file-edit"></i><span> {{ $t('message.seeStatistics') }}</span></Tab
            >
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <PresentationProviderSection />
            </TabPanel>

            <TabPanel value="1">
              <ServicesProviderSection />
            </TabPanel>
          </TabPanels> </Tabs></template
    ></Card>
  </div>
</template>

<script setup>
import { Card, Tabs, Tab, TabPanel, TabPanels, TabList } from 'primevue'

import PresentationProviderSection from '@/components/providerComponents/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/ServicesProviderSection.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import { useProviderStore } from '@/stores/providers'

const providerStore = useProviderStore()
</script>
