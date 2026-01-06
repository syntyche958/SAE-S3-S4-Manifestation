<template>
  <div class="card relative" style="max-width: 400px">
    <Galleria
      v-if="images && images.length > 0"
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
      :key="images.length"
    >
      <template #header>
        <ProviderImageModifier />
      </template>
      <template #item="slotProps">
        <div v-if="slotProps && slotProps.item" class="relative">
          <img
            :src="slotProps.item.itemImageSrc"
            :alt="slotProps.item.alt"
            style="width: 100%; border-radius: 5px"
          />
          <div
            v-if="!isProviderAdminPanelToHide()"
            class="flex justify-center z-50 absolute top-0 left-0 mt-5 ml-5"
          >
            <Button
              style="font-size: 25px; padding: 0 10px"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              @click.stop="handleDeleteImage(slotProps.item.id)"
            />
          </div>
        </div>
      </template>
      <template #thumbnail="slotProps">
        <img
          v-if="slotProps && slotProps.item"
          :src="slotProps.item.thumbnailImageSrc"
          :alt="slotProps.item.alt"
        />
      </template>
    </Galleria>
    <div v-else-if="images === null">Chargement...</div>
    <div v-else>Aucune image disponible</div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers.js'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import Galleria from 'primevue/galleria'
import Button from 'primevue/button'
import ProviderImageModifier from './ProviderImageModifier.vue'

const route = useRoute()
const images = ref(null)
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

const providerId = computed(() => Number.parseInt(route.params.provider_id))

watchEffect(async () => {
  images.value = await providerStore.getProviderImages(providerId.value)
})

const handleDeleteImage = async (imageIndex) => {
  // TODO : faire marcher le suppr
  try {
    if (images.value && imageIndex >= 0 && imageIndex < images.value.length) {
      await providerStore.deleteProviderImage(providerId.value, imageIndex)
      images.value = await providerStore.getProviderImages(providerId.value)
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}

.delete-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
