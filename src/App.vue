<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue'
import { useLocationStore } from './stores/locations';

const authStore = useAuthStore()
const locationStore = useLocationStore()
onMounted(async () => {
  authStore.getUser()
  locationStore.getAllLocations()
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
