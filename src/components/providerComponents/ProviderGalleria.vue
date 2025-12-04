<template>
  <div class="card" style="max-width: 400px">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
    >
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
    <div v-if="!isProviderAdminPanelToHide()">
      <div class="card flex justify-center" style="margin-top: 25px">
        <Button
          icon="pi pi-pen-to-square"
          style="font-size: 25px; padding: 0 6px"
          @click="visibleCarrousel = true"
        />
        <Dialog
          v-model:visible="visibleCarrousel"
          modal
          header="Modification des images : "
          :style="{ width: '50vw' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <UploadImages />
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Galleria from 'primevue/galleria'
import UploadImages from '@/components/providerComponents/ProviderUploadImages.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'

const visibleCarrousel = ref(false)
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
