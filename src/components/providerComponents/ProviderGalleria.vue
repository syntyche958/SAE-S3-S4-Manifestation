<template>
  <div class="card relative" style="max-width: 400px">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
    >
      <template #header>
        <ProviderImageModifier />
      </template>
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%; border-radius: 5px"
        />
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
      </template>
    </Galleria>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers.js'
import Galleria from 'primevue/galleria'
import ProviderImageModifier from './ProviderImageModifier.vue'

const route = useRoute()
const images = ref()
const providerStore = useProviderStore()
const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
  },
])

watchEffect(
  async () =>
    (images.value = await providerStore.getProviderImages(
      Number.parseInt(route.params.provider_id),
    )),
)
</script>
