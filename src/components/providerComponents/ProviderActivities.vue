<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Card } from 'primevue'
import router from '@/router/index.js'
import { useActivityStore } from '@/stores/activities'
import placeholder from '@/assets/images/photos/placeholder.jpg'
import ProviderActivityEditor from './ProviderActivityEditor.vue'

const route = useRoute()
const activityStore = useActivityStore()

const activities = computed(() => {
  const providerId = Number.parseInt(route.params.provider_id)
  return activityStore.activities.filter((a) => a.providerId === providerId)
})

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

<template>
  <section style="margin: 3rem">
    <h1 class="text-center texturina-title">{{ $t('message.activities') }}</h1>
    <div class="flex justify-center">
      <div v-for="(item, index) in activities" :key="index">
        <Card
          class="activity-card relative"
          style="width: 250px; overflow: hidden; cursor: pointer"
          @click="goToActivity(item.id)"
        >
          <template #header>
            <ProviderActivityEditor />
            <img style="object-fit: cover" alt="user header" :src="placeholder" />
          </template>
          <template #title>{{ item.name }}</template>
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

<style scoped>
.activity-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin: 2rem;
}

.activity-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
</style>
