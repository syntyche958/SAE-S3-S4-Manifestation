<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue'

const authStore = useAuthStore()
onMounted(async () => {
  await authStore.getUser()
})
</script>

<template>
  <header>
    <NavBar />
    <BreadcrumbNav />
  </header>

  <Main>
    <RouterView />
  </Main>
</template>
