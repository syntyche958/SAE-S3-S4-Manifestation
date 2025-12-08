<template>
  <div
    v-if="!isProviderAdminPanelToHide()"
    class="flex justify-center absolute top-0 right-0 mt-5 mr-5 z-10"
  >
    <Button
      icon="pi pi-pen-to-square"
      style="font-size: 25px; padding: 0 6px"
      @click="displayDialog = true"
    />
    <Dialog
      v-model:visible="displayDialog"
      modal
      header="Modification du texte de présentation : "
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <ProviderEditor @hide-dialog="displayDialog = false" />
    </Dialog>
  </div>
</template>

<script setup>
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import ProviderEditor from '@/components/providerComponents/molecule/ProviderEditor.vue'
import { ref } from 'vue'
import { Dialog, Button } from 'primevue'

const displayDialog = ref(false)
</script>
