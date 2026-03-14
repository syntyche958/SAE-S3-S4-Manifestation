<script setup>
import { useRoute } from 'vue-router'
import StatisticsProviderSection from '@/components/providerComponents/organism/StatisticsProviderSection.vue'

const route = useRoute()
const providerId = route.params.provider_id
</script>

<template>
  <div class="provider-statistics-view">
    <StatisticsProviderSection :provider-id="providerId" />
  </div>
</template>

<style scoped>
.provider-statistics-view {
  min-height: 100vh;
  background-color: var(--surface-ground);
}
</style>
