<template>
  <div class="w-1/2 relative">
    <Card class="card-presentation">
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

<script setup>
import Card from 'primevue/card'
import ProviderDescEditor from '@/components/providerComponents/ProviderDescEditor.vue'
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
