<template>
  <!-- Visitor -->
  <div v-if="authStore.user?.type == UserTypeEnum.VISITOR">
    <PresentationProviderSection />
  </div>

  <!-- Provider / Admin -->
  <div v-else>
    <Tabs value="0">
      <TabList>
        <Tab value="0"><i class="pi pi-file-edit"></i><span> Apparence de la page</span></Tab>
        <Tab value="1"><i class="pi pi-file-edit"></i><span> Choix des services</span></Tab>
        <Tab disabled><i class="pi pi-file-edit"></i><span> Regarder les statistiques</span></Tab>
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

  <ProviderFooter />
</template>

<script setup>
import PresentationProviderSection from '@/components/providerComponents/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/ServicesProviderSection.vue'

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useAuthStore } from '@/stores/auth';
import { UserTypeEnum } from '@/enums/User.enum';
import ProviderFooter from '@/components/providerComponents/ProviderFooter.vue';

const authStore = useAuthStore()
</script>
