<template>
  <div>
    <h2>{{ $t('message.configurationOfTheActivity') }}</h2>
    <div class="flex align-items-center gap-2" v-if="currentActivity">
      <session-c-r-u-d />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityStore } from '@/stores/activities'
import SessionCRUD from '@/components/activityComponents/molecule/SessionCRUD.vue'

const route = useRoute()
const activityStore = useActivityStore()

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((a) => a.id === activityId)
})
</script>
