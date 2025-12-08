<template>
  <div
    v-if="!isProviderAdminPanelToHide()"
    class="flex justify-center z-50 absolute top-0 right-0 mt-5 mr-5"
  >
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
      <ProviderUploadImages />
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button, Dialog } from 'primevue'
import ProviderUploadImages from './ProviderUploadImages.vue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'

const visibleCarrousel = ref(false)
</script>
