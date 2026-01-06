<template>
  <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
    <h2>{{ $t('message.signIn') }}</h2>
    <div class="flex flex-col gap-2">
      <label for="username">Mail</label>
      <InputText id="username" type="email" v-model="mail" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="password">{{ $t('message.password') }}</label>
      <InputText id="password" type="password" v-model="password" />
    </div>
    <div class="flex">
      <Button
        label="Sign in"
        icon="pi pi-user"
        class="w-full max-w-[17.35rem] mx-auto"
        @click="signin"
      ></Button>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { InputText, Button } from 'primevue'
import { ref } from 'vue'

const authStore = useAuthStore()

const mail = ref()
const password = ref()

const emit = defineEmits(['close-dialog'])

async function signin() {
  const signedIn = await authStore.signin(mail.value, password.value)
  if (signedIn) {
    emit('close-dialog')
  }
}
</script>
