<template>
  <!-- Visitor -->
  <div v-if="isProviderAdminPanelToHide()" class="page-shell">
    <Card class="main-section-container provider-page-card">
      <template #content>
        <h1 class="text-center texturina-title provider-page-title">
          {{ providerStore.get(Number($route.params.provider_id)).name }}
        </h1>
        <PresentationProviderSection />
      </template>
    </Card>
  </div>

  <!-- Provider / Admin -->
  <div v-else class="page-shell">
    <Card class="main-section-container provider-page-card">
      <template #content>
        <h1 class="text-center texturina-title provider-page-title">
          {{ providerStore.get(Number($route.params.provider_id)).name }}
        </h1>
        <Tabs value="0" class="provider-tabs">
          <TabList>
            <Tab value="0">
              <i class="pi pi-file-edit"></i><span>{{ $t('message.appearanceOfThePage') }}</span>
            </Tab>
            <Tab value="1">
              <i class="pi pi-file-edit"></i><span>{{ $t('message.chooseServices') }}</span>
            </Tab>
            <Tab value="2">
              <i class="pi pi-chart-bar"></i><span>{{ $t('message.seeStatistics') }}</span>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <PresentationProviderSection />
            </TabPanel>

            <TabPanel value="1">
              <ServicesProviderSection />
            </TabPanel>

            <TabPanel value="2">
              <StatisticsProviderSection :provider-id="Number($route.params.provider_id)" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card, Tabs, Tab, TabPanel, TabPanels, TabList } from 'primevue'

import PresentationProviderSection from '@/components/providerComponents/organism/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/organism/ServicesProviderSection.vue'
import StatisticsProviderSection from '@/components/providerComponents/organism/StatisticsProviderSection.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import { useProviderStore } from '@/stores/providers'

const providerStore = useProviderStore()
</script>

<style scoped>
.page-shell {
  display: flex;
  justify-content: center;
}

.provider-page-card {
  margin-top: 0;
}

.provider-page-title {
  margin-bottom: 0;
  line-height: 1.2;
}

.provider-tabs {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.provider-tabs :deep(.p-tablist) {
  margin-bottom: 0;
}

.provider-tabs :deep(.p-tab) {
  gap: 0.45rem;
}
</style>
