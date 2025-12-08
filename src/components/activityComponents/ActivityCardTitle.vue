<template>
  <div class="relative">
    <h1 class="text-center texturina-title">
      {{ activityStore.get(Number($route.params.activity_id)).name }}
    </h1>
    <div class="absolute top-0 left-0">
      <Button
        :label="
          providerStore.get(activityStore.get(Number($route.params.activity_id)).providerId).name
        "
        @click="
          $router.push(
            `/provider/${activityStore.get(Number($route.params.activity_id)).providerId}`,
          )
        "
        icon="pi pi-angle-left"
        severity="contrast"
        size="small"
        variant="outlined"
      />
    </div>
  </div>
</template>

<script setup>
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { Button } from 'primevue'

const activityStore = useActivityStore()
const providerStore = useProviderStore()
</script>
