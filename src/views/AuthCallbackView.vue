<template>
  <section class="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <i class="pi pi-spin pi-spinner text-3xl"></i>
    <p>Connexion en cours...</p>
    <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

onMounted(async () => {
  const result = await authStore.handleOAuthCallback(window.location.search)
  if (result.ok) {
    router.replace('/')
    return
  }

  errorMessage.value = "Echec de l'authentification Google. Redirection..."
  setTimeout(() => {
    router.replace('/')
  }, 1500)
})
</script>
