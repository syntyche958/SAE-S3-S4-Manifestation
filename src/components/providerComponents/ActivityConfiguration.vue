<template>
  <div>
    <h2>Configuration de l'activité</h2>
    <div class="flex align-items-center gap-2" v-if="currentActivity">
      <Checkbox v-model="currentActivity.canRegister" inputId="can-register" :binary="true" />
      <label for="can-register">Activer l'inscription</label>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Checkbox } from 'primevue'
import { useActivityStore } from '@/stores/activities'

const route = useRoute()
const activityStore = useActivityStore()

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((a) => a.id === activityId)
})
</script>
