<script setup>
import { onMounted } from 'vue'
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

const authStore = useAuthStore()
const locationStore = useLocationStore()
const providerStore = useProviderStore()
const presentationStore = usePresentationStore()
const activityStore = useActivityStore()

setToast(useToast())

onMounted(async () => {
  await authStore.getUser()
  await locationStore.getAllLocations()
  await presentationStore.getPresentationContent()
  await providerStore.getAllProviders()
  await providerStore.getAllNewProviders()
  await activityStore.getAllActivities()
  // TODO : Appeler seulement quand necessaire, dans AdminView quand le composant concerné est affiché !
  // TODO : Mettre un watch la dessus !!!
  // if (authStore.user.type === UserTypeEnum.ADMIN) {
  //   await providerStore.getAllNewProviders()
  //   await contactStore.getAllContacts()
  // } else if (authStore.user.type === UserTypeEnum.PROVIDER) {
  //   await contactStore.getAllContactsById(authStore.user.id)
  // }
})
</script>

<template>
  <AnimatedBackground />
  <Toast position="top-center" />
  <NavBar />

  <RouterView />

  <TheFooter />
</template>
