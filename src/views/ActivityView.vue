<template>
  <div v-if="isProviderAdminPanelToHide()" class="page-shell">
    <Card class="main-section-container activity-page-card">
      <template #content>
        <ActivityCardTitle />
        <div class="activity-page-body">
          <ActivityPresentation />
        </div>
      </template>
    </Card>
  </div>

  <div v-else class="page-shell">
    <Card class="main-section-container activity-page-card">
      <template #content>
        <ActivityCardTitle />
        <div class="activity-page-body">
          <ActivityMenuTabs />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'primevue'

import ActivityPresentation from '@/components/activityComponents/molecule/ActivityPresentation.vue'
import ActivityCardTitle from '@/components/activityComponents/molecule/ActivityCardTitle.vue'
import ActivityMenuTabs from '@/components/activityComponents/organism/ActivityMenuTabs.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
</script>

<style scoped>
.page-shell {
  display: flex;
  justify-content: center;
}

.activity-page-card {
  margin-top: 0;
}

.activity-page-body {
  margin-top: 0;
}
</style>
