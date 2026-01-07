<template>
  <div class="card relative" style="max-width: 400px">
    <Galleria
      v-if="images && images.length > 0"
      :value="images || []"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
      :key="`galleria-${providerId}-${images ? images.length : 0}-${images ? images.map(img => img.id || img.idImage).join('-') : ''}`"
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
              @click.stop="handleDeleteImage(slotProps.item.id || slotProps.item.idImage)"
            />
          </div>
        </div>
        <div v-else class="flex items-center justify-center" style="min-height: 300px; width: 100%">
          <p class="text-gray-500">Aucune image disponible</p>
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
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers.js'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import { displayErrToast } from '@/utils/toast.utils'
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

const handleDeleteImage = async (imageId) => {
  try {
    if (!images.value || images.value.length === 0) return

    const realImages = images.value.filter(img => !img.isPlaceholder)
    if (realImages.length <= 2) {
      displayErrToast('Le minimum requis est de 2 images.')
      return
    }
    const imageToDelete = images.value.find(
      (img) => (img.id === imageId || img.idImage === imageId) && !img.isPlaceholder
    )

    if (!imageToDelete) {
      return
    }

    const fullIndex = images.value.findIndex(
      (img) => (img.id === imageId || img.idImage === imageId) && !img.isPlaceholder
    )

    if (fullIndex === -1) {
      console.error("Image non trouvée avec l'id:", imageId)
      return
    }

    const imageIndex = realImages.findIndex(
      (img) => img.id === imageId || img.idImage === imageId
    )

    if (imageIndex === -1) {
      console.error("Image non trouvée dans les images réelles")
      return
    }

    await providerStore.deleteProviderImage(providerId.value, imageIndex)

    images.value = images.value.filter(
      (img) => img.id !== imageId && img.idImage !== imageId
    )

    const updatedImages = await providerStore.getProviderImages(providerId.value)
    images.value = updatedImages
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
    images.value = await providerStore.getProviderImages(providerId.value)
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
