<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/locations'
import { useProviderStore } from '@/stores/providers'
import { usePresentationStore } from '@/stores/presentation'
import { UserTypeEnum } from '@/enums/User.enum'
import Toast from 'primevue/toast'
import { useToast } from 'primevue'
import { setToast } from './utils/toast.utils'
import TheFooter from './components/TheFooter.vue'
import { useContactStore } from './stores/contact'

const authStore = useAuthStore()
const locationStore = useLocationStore()
const providerStore = useProviderStore()
const presentationStore = usePresentationStore()
const contactStore = useContactStore()

setToast(useToast())

onMounted(async () => {
  await authStore.getUser()
  await locationStore.getAllLocations()
  await presentationStore.getPresentationContent()
  await providerStore.getAllProviders()
  // TODO : Appeler seulement quand necessaire, dans AdminView quand le composant concerné est affiché !
  if (authStore.user.type === UserTypeEnum.ADMIN) {
    await providerStore.getAllNewProviders()
    await contactStore.getAllContacts()
  } else if (authStore.user.type === UserTypeEnum.PROVIDER) {
    await contactStore.getAllContactsById(authStore.user.id)
  }
})
</script>

<template>
  <Toast position="top-center" />
  <header>
    <NavBar />
  </header>

  <RouterView />

  <TheFooter />
</template>
