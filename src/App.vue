<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue'
import { useLocationStore } from '@/stores/locations';
import { useProviderStore } from './stores/providers';

const authStore = useAuthStore()
const locationStore = useLocationStore()
const providerStore = useProviderStore()

onMounted(async () => {
  await authStore.getUser()
  await locationStore.getAllLocations()

  // TODO : Use enum
  // TODO : Appeler seulement quand necessaire, dans AdminView quand le composant concerné est affiché !
  if (authStore.user.type == 'admin') {
    providerStore.getAllNewProviders()
  }
})
</script>

<template>
  <header>
    <NavBar />
    <BreadcrumbNav />
  </header>

  <Toast/>

  <Main>
    <RouterView />
  </Main>
</template>
