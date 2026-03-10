<template>
  <div class="w-1/2 relative">
    <Card class="card-presentation dark-presentation-card">
      <template #title> <ProviderDescEditor /> </template>
      <template #content>
        <div class="relative">
          <h2 class="mb-3 text-2xl font-semibold">{{ $t('message.whoAreWe') }}</h2>
          <div class="description-content" v-html="description"></div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.dark-presentation-card) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
}

.description-content :deep(*) {
  color: #fafafa !important;
}
</style>

<script setup>
import Card from 'primevue/card'
import ProviderDescEditor from '@/components/providerComponents/molecule/ProviderDescEditor.vue'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'

const providerStore = useProviderStore()
const route = useRoute()

const description = ref()

watchEffect(async () => {
  description.value = await providerStore.getDescription(Number.parseInt(route.params.provider_id))
})
</script>
