<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

import PresentationProviderSection from '@/components/providerComponents/PresentationProviderSection.vue'
import ServicesProviderSection from '@/components/providerComponents/ServicesProviderSection.vue'
import StatisticsProviderSection from '@/components/providerComponents/StatisticsProviderSection.vue'
import SideBarMenuProvider from '@/components/providerComponents/SideBarMenuProvider.vue'
import SideBarMenuAdmin from '@/components/providerComponents/SideBarMenuAdmin.vue'

const section = ref('apparence')
function setActiveSection(nameSection) {
  section.value = nameSection
}
const currentProviderSectionComponent = computed(() => {
  if (section.value === 'apparence') return PresentationProviderSection
  if (section.value === 'services') return ServicesProviderSection
  return StatisticsProviderSection
})

onMounted(() => {
  if (!authStore.user) {
    authStore.getUser()
  }
})

const showSidebarProvider = computed(() => {
  const role = authStore.user?.type
  return role === 'provider'
})

const showSidebarAdmin = computed(() => {
  const role = authStore.user?.type
  return role === 'admin'
})

</script>

<template>
  <div v-if="showSidebarProvider">
    <div style="display: flex">
      <SideBarMenuProvider @change-section="setActiveSection" />
      <component :is="currentProviderSectionComponent" />
    </div>
  </div>
  <div v-else-if="showSidebarAdmin">
    <div style="display: flex">
      <SideBarMenuAdmin @change-section="setActiveSection" />
      <component :is="currentProviderSectionComponent" />
    </div>
  </div>
  <div v-else>
    <div style="display: flex">
      <component :is="currentProviderSectionComponent" />
    </div>
  </div>
</template>
