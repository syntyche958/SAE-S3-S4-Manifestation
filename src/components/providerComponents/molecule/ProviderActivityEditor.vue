<template>
  <div
    v-if="!isProviderAdminPanelToHide()"
    class="flex justify-center absolute top-0 right-0 mt-5 mr-5 z-50"
  >
    <Button
      icon="pi pi-pen-to-square"
      style="font-size: 25px; padding: 0 6px"
      @click="visibleActivity = true"
    />
    <Dialog
      v-model:visible="visibleActivity"
      modal
      header="Modification des activités : "
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <ProviderEditor v-for="(item2, index2) in activities" :key="index2" />
    </Dialog>
  </div>
</template>

<script setup>
import { Button, Dialog } from 'primevue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import ProviderEditor from '@/components/providerComponents/molecule/ProviderEditor.vue'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useActivityStore } from '@/stores/activities'

const route = useRoute()
const visibleActivity = ref(false)
const activityStore = useActivityStore()

const activities = computed(() => {
  const providerId = Number.parseInt(route.params.provider_id)
  return activityStore.activities.filter((a) => a.providerId === providerId)
})
</script>
