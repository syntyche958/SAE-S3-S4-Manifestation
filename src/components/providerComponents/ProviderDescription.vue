<script setup>
import { UserTypeEnum } from '@/enums/User.enum.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Editor from '@/components/providerComponents/ProviderEditor.vue'
import { ref, watchEffect } from 'vue'
import { useDescriptionStore } from '@/stores/providerDescription.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRoute } from 'vue-router'

const visibleDescription = ref(false)
const providerDescription = useDescriptionStore()
const authStore = useAuthStore()
const route = useRoute()

providerDescription.getProviderDescriptionFromService(Number.parseInt(route.params.provider_id))

watchEffect(() => {
  if (providerDescription.closeDialog) {
    visibleDescription.value = false
    providerDescription.closeDialog = false
  }
})
</script>

<template>
  <div class="all">
    <Card class="card-presentation">
      <template #content>
        <h2>Qui sommes-nous ?</h2>
        <div class="description-content" v-html="providerDescription.description"></div>
      </template>
    </Card>
    <div
      v-if="
        authStore.user?.type === UserTypeEnum.ADMIN ||
        (authStore.user?.type === UserTypeEnum.PROVIDER &&
          Number.parseInt(route.params.provider_id) === authStore.user?.id)
      "
    >
      <div class="card flex justify-center" style="margin-top: 25px">
        <Button
          label="✎"
          style="font-size: 25px; padding: 0 6px"
          @click="visibleDescription = true"
        />
        <Dialog
          v-model:visible="visibleDescription"
          modal
          header="Modification du texte de présentation : "
          :style="{ width: '50vw' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <Editor />
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-presentation h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.all {
  width: 50%;
}
</style>
