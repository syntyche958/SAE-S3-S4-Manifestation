<template>
  <section style="margin: 3rem">
    <div class="flex justify-center items-center">
      <h1 class="text-center texturina-title mr-3">{{ $t('message.activities') }}</h1>
      <AddActivity />
    </div>
    <div class="flex justify-center flex-wrap">
      <div v-for="(item, index) in activities" :key="index">
        <Card
          class="activity-card dark-presentation-card relative"
          style="width: 250px; overflow: hidden; cursor: pointer"
          @click="goToActivity(item.id)"
        >
          <template #title>{{ item.name }}</template>
          <template #subtitle>
            <div class="flex align-items-center gap-2 mt-2" v-if="item.ratings">
              <span class="text-sm font-bold">{{ getAverageRating(item) }}/5</span>
              <Rating :modelValue="getAverageRating(item)" readonly :cancel="false" />
              <span class="text-xs">({{ item.ratings.length }} avis)</span>
            </div>
          </template>
          <template #content>
            <p class="m-0">
              {{ item.description }}
            </p>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Card, Rating } from 'primevue'
import router from '@/router/index.js'
import { useActivityStore } from '@/stores/activities'
import AddActivity from '@/components/activityComponents/molecule/AddActivity.vue'

const route = useRoute()
const activityStore = useActivityStore()

const activities = computed(() => {
  const providerId = Number.parseInt(route.params.provider_id)
  return activityStore.activities.filter((a) => a.providerId === providerId)
})

function getAverageRating(item) {
  if (!item.ratings || item.ratings.length === 0) return 0
  const sum = item.ratings.reduce((acc, curr) => acc + curr.note, 0)
  return Math.round((sum / item.ratings.length) * 10) / 10
}

function goToActivity(activityId) {
  router.push({
    name: 'activity_page',
    params: {
      provider_id: route.params.provider_id,
      activity_id: activityId,
    },
  })
}
</script>

<style scoped>
:deep(.dark-presentation-card) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
}

.activity-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin: 2rem;
}

.activity-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}

:deep(.p-card-title),
:deep(.p-card-content) {
  color: #fafafa !important;
}
</style>
