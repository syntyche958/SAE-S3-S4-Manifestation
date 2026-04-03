<script setup>
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/globalComponents/molecule/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/locations'
import { useProviderStore } from '@/stores/providers'
import { usePresentationStore } from '@/stores/presentation'
import Toast from 'primevue/toast'
import { useToast } from 'primevue'
import { setToast } from '@/utils/toast.utils'
import TheFooter from '@/components/globalComponents/molecule/TheFooter.vue'
import { useActivityStore } from '@/stores/activities'
import AnimatedBackground from '@/components/globalComponents/molecule/AnimatedBackground.vue'
import { useSurveyStore } from '@/stores/surveys'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const authStore = useAuthStore()
const locationStore = useLocationStore()
const providerStore = useProviderStore()
const presentationStore = usePresentationStore()
const activityStore = useActivityStore()
const surveyStore = useSurveyStore()

setToast(useToast())

onMounted(async () => {
  await authStore.getUser()

  await locationStore.getAllLocations()
  await presentationStore.getPresentationContent()
  await providerStore.getAllProviders()
  await providerStore.getAllNewProviders()
  await activityStore.getAllActivities()
  await surveyStore.getAllSurveys()
})

watch(
  () => locale.value,
  () => {
    Promise.all([
      presentationStore.getPresentationContent(),
      providerStore.getAllProviders(),
      activityStore.getAllActivities(),
    ])
  },
)
</script>

<template>
  <div class="app-shell">
    <AnimatedBackground />
    <Toast position="top-center" />
    <NavBar />

    <main class="app-content">
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>
