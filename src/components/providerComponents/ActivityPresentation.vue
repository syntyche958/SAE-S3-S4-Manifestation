<template>
  <div v-if="currentActivity">
    <div v-html="currentActivity.name"></div>
    <div v-html="currentActivity.presentationContent"></div>
    <div style="margin-top: 1rem" v-if="currentActivity?.canRegister">
      <Button label="S'inscrire" icon="pi pi-user-plus" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from 'primevue'
import { useActivityStore } from '@/stores/activities'

const route = useRoute()
const activityStore = useActivityStore()

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((a) => a.id === activityId)
})
</script>
