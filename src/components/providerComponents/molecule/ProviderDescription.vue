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
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const providerStore = useProviderStore()
const route = useRoute()

const descriptionBase = ref('')
const descriptionFr = ref('')
const descriptionEn = ref('')

const description = computed(() => {
  if (locale.value === 'en') return descriptionEn.value || descriptionBase.value
  return descriptionFr.value || descriptionBase.value
})

watchEffect(async () => {
  const providerId = Number.parseInt(route.params.provider_id)
  const provider = providerStore.providers.find((p) => p.id === providerId)
  descriptionBase.value = provider?.description || ''
  descriptionFr.value = provider?.descriptionFr || provider?.description || ''
  descriptionEn.value = provider?.descriptionEn || ''
})
</script>
