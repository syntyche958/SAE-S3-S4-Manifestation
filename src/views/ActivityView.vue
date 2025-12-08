<template>
  <div v-if="isProviderAdminPanelToHide()" class="flex justify-center">
    <Card class="main-section-container"
      ><template #content>
        <ActivityCardTitle />
        <ActivityPresentation />
      </template>
    </Card>
  </div>

  <div v-else class="flex justify-center">
    <Card class="main-section-container">
      <template #content>
        <ActivityCardTitle />
        <ActivityMenuTabs />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'primevue'

import ActivityPresentation from '@/components/providerComponents/ActivityPresentation.vue'
import ActivityCardTitle from '@/components/activityComponents/ActivityCardTitle.vue'
import ActivityMenuTabs from '@/components/activityComponents/ActivityMenuTabs.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
</script>
