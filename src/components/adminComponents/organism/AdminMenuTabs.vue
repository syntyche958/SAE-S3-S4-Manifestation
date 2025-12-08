<template>
  <div class="flex justify-center">
    <Card class="main-section-container">
      <template #content>
        <h1 class="text-center">{{ $t('message.adminPage') }}</h1>
        <Tabs value="0">
          <TabList>
            <Tab value="0"
              ><i class="pi pi-file-edit mr-2"></i
              ><span>{{ $t('message.administerTheEvent') }}</span></Tab
            >
            <Tab value="1"
              ><i class="pi pi-map mr-2"></i><span>{{ $t('message.interactiveMap') }}</span></Tab
            >
            <Tab value="2"
              ><i class="pi pi-users mr-2"></i
              ><span>{{ $t('message.manageProviderRequests') }}</span></Tab
            >
            <Tab value="3"
              ><i class="pi pi-home mr-2"></i
              ><span>{{ $t('message.providerDashboard') }}</span></Tab
            >
            <Tab value="4"
              ><i class="pi pi-chart-bar mr-2"></i><span>{{ $t('message.statistics') }}</span></Tab
            >
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <EventEditorSmall />
              <EventEditorBig />
            </TabPanel>

            <TabPanel value="1">
              <!-- <h1>{{ $t('message.interactiveMap') }}</h1> -->
              <div class="flex gap-2.5">
                <TheMap
                  :displayMode="MapModeEnum.ADMIN"
                  @change-selected-location="
                    (sl) => {
                      selectedLocationId = sl
                    }
                  "
                  class="w-fit"
                  classSize="sm:h-[50vh] sm:w-[70vh]"
                />
                <AdminMapChoosing
                  :selectedLocationId="selectedLocationId"
                  @update-selected-location-id="(value) => (selectedLocationId = value)"
                />
              </div>
            </TabPanel>

            <TabPanel value="2">
              <ManageNewProviders />
            </TabPanel>

            <TabPanel value="3">
              <h1>{{ $t('message.providerDashboard') }}</h1>
            </TabPanel>

            <TabPanel value="4">
              <AdminStats />
            </TabPanel>
          </TabPanels> </Tabs
      ></template>
    </Card>
  </div>
</template>

<script setup>
import EventEditorSmall from '@/components/adminComponents/molecule/EventEditorSmall.vue'
import TheMap from '@/components/TheMap.vue'
import { MapModeEnum } from '@/enums/Map.enums'
import AdminStats from '@/components/adminComponents/organism/AdminStats.vue'
import ManageNewProviders from '@/components/adminComponents/molecule/ManageNewProviders.vue'
import { Tabs, TabList, Tab, TabPanel, TabPanels, Card } from 'primevue'
import { ref } from 'vue'
import AdminMapChoosing from '@/components/adminComponents/molecule/AdminMapChoosing.vue'
import EventEditorBig from '@/components/adminComponents/molecule/EventEditorBig.vue'

const selectedLocationId = ref()
</script>
