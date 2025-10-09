<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { useAuthStore } from './stores/auth';
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const userType = ref('visitor')
onMounted(async () => {
  await authStore.getUser()
  userType.value = authStore.user[0]["type"]
})
</script>

<template>
  <header>
    <NavBar :userType="userType" />
    <BreadcrumbNav />
  </header>

  <Main>
    <RouterView />
  </Main>
</template>
