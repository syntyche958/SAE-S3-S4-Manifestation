<template>
  <div class="w-1/2">
    <Card class="card-presentation">
      <template #content>
        <h2>{{ $t('message.whoAreWe') }}</h2>
        <div class="description-content" v-html="description"></div>
      </template>
    </Card>
    <div v-if="!isProviderAdminPanelToHide()">
      <div class="card flex justify-center" style="margin-top: 25px">
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
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import ProviderEditor from '@/components/providerComponents/ProviderEditor.vue'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'

const providerStore = useProviderStore()
const route = useRoute()

const displayDialog = ref(false)
const description = ref()

watchEffect(async () => {
  description.value = await providerStore.getDescription(Number.parseInt(route.params.provider_id))
})
</script>

<style scoped>
/* TODO : TOUT les h2 doivent avoir le même CSS, définit dans main.css sinon utiliser div */
.card-presentation h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}
</style>
