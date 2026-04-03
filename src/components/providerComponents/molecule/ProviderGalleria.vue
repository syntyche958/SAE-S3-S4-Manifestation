<template>
  <ConfirmDialog />
  <Card class="provider-galleria-card relative w-full max-w-[400px]">
    <template #content>
      <Galleria
        v-if="images && images.length > 0"
        :value="images"
        circular
        :responsiveOptions="responsiveOptions"
        :numVisible="5"
        :containerStyle="{ width: '100%', maxWidth: '400px' }"
        :key="`galleria-${providerId}-${images ? images.length : 0}-${images ? images.map((img) => img.id || img.idImage).join('-') : ''}`"
      >
        <template #header>
          <ProviderImageModifier />
        </template>
        <template #item="slotProps">
          <div v-if="slotProps && slotProps.item" class="galleria-main-frame relative">
            <img
              class="galleria-main-img"
              :src="slotProps.item.itemImageSrc"
              :alt="slotProps.item.alt"
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
          <div v-else class="galleria-main-frame flex items-center justify-center">
            <p class="text-gray-500">{{ $t('message.noImage') }}</p>
          </div>
        </template>
        <template #thumbnail="slotProps">
          <img
            v-if="slotProps && slotProps.item"
            class="galleria-thumb-img"
            :src="slotProps.item.thumbnailImageSrc"
            :alt="slotProps.item.alt"
          />
        </template>
      </Galleria>
      <div
        v-else
        class="provider-galleria-empty relative w-full max-w-[400px]"
      >
        <ProviderImageModifier />
        <div class="galleria-main-frame flex items-center justify-center">
          <p class="text-gray-500 m-0">{{ $t('message.noImage') }}</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers.js'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import { displayErrToast } from '@/utils/toast.utils'
import { useI18n } from 'vue-i18n'
import Galleria from 'primevue/galleria'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import ProviderImageModifier from './ProviderImageModifier.vue'

const { t } = useI18n()
const route = useRoute()
const confirm = useConfirm()
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
  const pid = providerId.value
  providerStore.providerImageListRevision
  images.value = await providerStore.getProviderImages(pid)
})

const handleDeleteImage = async (imageId) => {
  if (!images.value || images.value.length === 0) return

  const realImages = images.value.filter((img) => !img.isPlaceholder)
  if (realImages.length <= 2) {
    displayErrToast('Le minimum requis est de 2 images.')
    return
  }

  confirm.require({
    message: 'Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.',
    header: 'Suppression',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Annuler',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Supprimer',
      severity: 'danger',
    },
    accept: async () => {
      try {
        const imageToDelete = images.value.find(
          (img) => (img.id === imageId || img.idImage === imageId) && !img.isPlaceholder,
        )

        if (!imageToDelete) {
          return
        }

        const fullIndex = images.value.findIndex(
          (img) => (img.id === imageId || img.idImage === imageId) && !img.isPlaceholder,
        )

        if (fullIndex === -1) {
          console.error("Image non trouvée avec l'id:", imageId)
          return
        }

        const imageIndex = realImages.findIndex((img) => img.id === imageId || img.idImage === imageId)

        if (imageIndex === -1) {
          console.error('Image non trouvée dans les images réelles')
          return
        }

        await providerStore.deleteProviderImage(providerId.value, imageId)

        images.value = images.value.filter((img) => img.id !== imageId && img.idImage !== imageId)

        const updatedImages = await providerStore.getProviderImages(providerId.value)
        images.value = updatedImages
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error)
        images.value = await providerStore.getProviderImages(providerId.value)
      }
    },
  })
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

/* Zone principale : dimensions fixes, l’image est recadrée sans agrandir la carte */
.galleria-main-frame {
  width: 100%;
  height: var(--provider-galleria-main-h, 280px);
  overflow: hidden;
  border-radius: 5px;
  background: var(--p-surface-100, #f4f4f5);
}

.galleria-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.galleria-thumb-img {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}

.provider-galleria-card :deep(.p-card-body) {
  padding: 0.75rem;
}

.provider-galleria-card :deep(.p-galleria-item) {
  width: 100%;
}
</style>
