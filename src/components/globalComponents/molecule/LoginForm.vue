<template>
  <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
    <h2>{{ $t('message.login') }}</h2>
    <div class="flex flex-col gap-2">
      <label for="login-mail-input">Mail</label>
      <InputText id="login-mail-input" type="email" v-model="mail" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="login-password-input">{{ $t('message.password') }}</label>
      <InputText id="login-password-input" type="password" v-model="password" />
    </div>
    <div class="flex">
      <Button
        label="Login"
        icon="pi pi-user"
        class="w-full max-w-[17.35rem] mx-auto"
        @click="login"
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

async function login() {
  const logedIn = await authStore.login(mail.value, password.value)
  if (logedIn) {
    emit('close-dialog')
  }
}
</script>
