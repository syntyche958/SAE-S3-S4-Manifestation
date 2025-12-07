<template>
  <BreadcrumbNav />
  <!-- Visitor -->
  <div v-if="isProviderAdminPanelToHide()">
    <PresentationProviderSection />
  </div>

  <!-- Provider / Admin -->
  <div v-else>
    <Tabs value="0">
      <TabList>
        <Tab value="0"
          ><i class="pi pi-file-edit"></i><span>{{ $t('message.appearanceOfThePage') }}</span></Tab
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
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import PresentationProviderSection from '@/components/providerComponents/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/ServicesProviderSection.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
</script>
