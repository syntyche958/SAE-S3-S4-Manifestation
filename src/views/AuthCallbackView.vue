<template>
  <section class="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <i class="pi pi-spin pi-spinner text-3xl"></i>
    <p>{{ $t('message.connectingInProgress') }}</p>
    <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

onMounted(async () => {
  const result = await authStore.handleOAuthCallback(window.location.search)
  if (result.ok) {
    router.replace('/')
    return
  }

  errorMessage.value = t('message.googleAuthFailedRedirect')
  setTimeout(() => {
    router.replace('/')
  }, 1500)
})
</script>
