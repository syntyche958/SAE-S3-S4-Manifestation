<template>
  <div class="relative">
    <div class="flex items-center justify-center gap-6">
      <h1 class="text-center texturina-title">
        {{ currentActivity?.name }}
      </h1>
      <div v-if="averageRating > 0" class="flex items-center gap-2 mt-2">
        <Rating :modelValue="averageRating" readonly :cancel="false" />
        <span class="text-sm font-bold">({{ averageRating }}/5)</span>
        <span class="text-xs text-surface-500">({{ currentActivity.ratings.length }} avis)</span>
      </div>
    </div>
    <div class="absolute top-0 left-0">
      <Button
        :label="providerStore.get(currentActivity?.providerId)?.name"
        @click="$router.push(`/provider/${currentActivity?.providerId}`)"
        icon="pi pi-angle-left"
        severity="contrast"
        size="small"
        variant="outlined"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { Button, Rating } from 'primevue'

const route = useRoute()
const activityStore = useActivityStore()
const providerStore = useProviderStore()

const currentActivity = computed(() => {
  return activityStore.get(Number(route.params.activity_id))
})

const averageRating = computed(() => {
  if (!currentActivity.value || !currentActivity.value.ratings || currentActivity.value.ratings.length === 0) {
    return 0
  }
  const sum = currentActivity.value.ratings.reduce((acc, curr) => acc + curr.note, 0)
  return Math.round((sum / currentActivity.value.ratings.length) * 10) / 10
})
</script>
