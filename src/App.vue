<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from '@/stores/auth';
import { useLocationStore } from '@/stores/locations';
import { useProviderStore } from '@/stores/providers';
import { usePresentationStore } from '@/stores/presentation';
import { UserTypeEnum } from '@/enums/User.enum';
import Toast from 'primevue/toast';
import { useToast } from 'primevue';
import { setToast } from './utils/toast.utils';

const authStore = useAuthStore()
const locationStore = useLocationStore()
const providerStore = useProviderStore()
const presentationStore = usePresentationStore()

setToast(useToast())

onMounted(async () => {
  await authStore.getUser()
  await locationStore.getAllLocations()
  await presentationStore.getPresentationContent()
  // TODO : Appeler seulement quand necessaire, dans AdminView quand le composant concerné est affiché !
  if (authStore.user.type === UserTypeEnum.ADMIN) {
    providerStore.getAllNewProviders()
  }
})
</script>

<template>
  <Toast />
  <header>
    <NavBar />
    <BreadcrumbNav />
  </header>

  <RouterView />
</template>
