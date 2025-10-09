<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore()
await authStore.getUser()
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
