<template>
  <AdminMenuTabs />
</template>

<script setup>
import AdminMenuTabs from '@/components/adminComponents/AdminMenuTabs.vue'
import { UserTypeEnum } from '@/enums/User.enum'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.user.type !== UserTypeEnum.ADMIN) router.push('/')
})
</script>
