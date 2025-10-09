<script setup>
import {computed, ref} from 'vue'
import PresentationProviderSection from '@/components/providerComponents/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/ServicesProviderSection.vue'
import StatisticsProviderSection from '@/components/providerComponents/StatisticsProviderSection.vue'
import SideBarMenuProvider from '@/components/providerComponents/SideBarMenuProvider.vue'

const section = ref('apparence')
function setActiveSection(nameSection){
  section.value = nameSection
}
const currentSectionComponent = computed(() => {
  if (section.value === 'apparence') return PresentationProviderSection
  if (section.value === 'services') return ServicesProviderSection
  return StatisticsProviderSection
})
</script>

<template>
  <div style="display: flex">
    <SideBarMenuProvider @change-section="setActiveSection" />
    <component :is="currentSectionComponent" />
  </div>
</template>
