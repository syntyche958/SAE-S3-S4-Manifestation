<template>
  <div class="flex justify-center">
    <Card class="w-full md:w-3/4 lg:w-1/2 m-4">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar-check text-2xl text-primary"></i>
          <span>{{ $t('message.providers') === 'Prestataires' ? 'Vos réservations' : 'Your Reservations' }}</span>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="flex justify-center p-4">
          <i class="pi pi-spin pi-spinner text-3xl"></i>
        </div>

        <div v-else-if="userSessions.length === 0" class="text-center p-6 text-surface-500">
          <i class="pi pi-calendar-times text-4xl mb-3"></i>
          <p>Vous n'avez aucune réservation pour le moment.</p>
          <Button label="Voir les activités" link @click="$router.push('/')" />
        </div>

        <DataView v-else :value="userSessions">
          <template #list="slotProps">
            <div class="flex flex-col gap-4">
              <div v-for="(item, index) in slotProps.items" :key="item.id" class="flex flex-col sm:flex-row sm:items-center p-4 gap-3 bg-surface-50 dark:bg-surface-900 rounded-border border border-surface-200 dark:border-surface-700">
                
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-lg">{{ getActivityName(item.activitiesId) }}</span>
                    <Tag :value="'Session #' + item.id" severity="info"></Tag>
                  </div>
                  
                  <div class="flex flex-col gap-1 text-sm text-surface-600 dark:text-surface-300">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-calendar"></i>
                      <span>{{ item.beginingDate }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                       <i class="pi pi-clock"></i>
                       <span>{{ item.beginingHour }} ({{ item.duration }} min)</span>
                    </div>
                  </div>
                </div>

                <div class="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                  <Button 
                    icon="pi pi-eye" 
                    text 
                    rounded 
                    v-tooltip.top="'Voir l\'activité'"
                    @click="goToActivity(item.activitiesId)" 
                  />
                </div>
                
              </div>
            </div>
          </template>
        </DataView>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSessionStore } from '@/stores/sessions'
import { useActivityStore } from '@/stores/activities'
import Card from 'primevue/card'
import DataView from 'primevue/dataview'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const router = useRouter()
const authStore = useAuthStore()
const sessionStore = useSessionStore()
const activityStore = useActivityStore()

const loading = ref(true)

const userSessions = computed(() => {
  if (!sessionStore.sessions || !authStore.user) return []
  return sessionStore.sessions.filter(session => 
    session.registersUsers && session.registersUsers.includes(authStore.user.id)
  )
})

const getActivityName = (activityId) => {
  const activity = activityStore.activities?.find(a => a.id === activityId)
  return activity ? activity.name : 'Activité inconnue'
}

const goToActivity = (activityId) => {
  const activity = activityStore.activities?.find(a => a.id === activityId)
  if (activity) {
    router.push(`/provider/${activity.providerId}/activity/${activity.id}`)
  }
}

onMounted(async () => {
  if (!sessionStore.sessions) {
    await sessionStore.getAllSessions()
  }
  if (!activityStore.activities) {
    await activityStore.getAllActivities()
  }
  loading.value = false
})
</script>
