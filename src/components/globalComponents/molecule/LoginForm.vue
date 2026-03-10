<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="login-mail-input" class="text-xs font-bold text-surface-400 uppercase ml-1">Email</label>
        <InputText id="login-mail-input" type="email" v-model="mail" fluid class="!rounded-xl border-surface-200/20 focus:border-emerald-500 bg-surface-100/10 text-white" placeholder="votre@email.fr" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="login-password-input" class="text-xs font-bold text-surface-400 uppercase ml-1">{{ $t('message.password') }}</label>
        <InputText id="login-password-input" type="password" v-model="password" fluid class="!rounded-xl border-surface-200/20 focus:border-emerald-500 bg-surface-100/10 text-white" placeholder="••••••••" />
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-2">
      <Button
        label="Connexion"
        icon="pi pi-sign-in"
        fluid
        class="!rounded-xl py-3 font-bold"
        severity="emerald"
        @click="login"
        v-ripple
      />

      <div class="relative flex items-center justify-center py-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-surface-100"></div>
        </div>
        <span class="relative px-3 text-xs text-surface-400 bg-surface-0 font-medium uppercase tracking-widest">Ou continuer avec</span>
      </div>

      <Button
        label="Google"
        icon="pi pi-google"
        severity="secondary"
        variant="outlined"
        fluid
        class="!rounded-xl !bg-surface-100/10 !text-white !border-surface-200/20 hover:!bg-surface-200/20"
        @click="loginWithGoogle"
        v-ripple
      />
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { InputText, Button } from 'primevue'
import { ref } from 'vue'

// TODO : Ajouter les verifs zod pour le format du mail

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

function loginWithGoogle() {
  authStore.loginWithGoogle()
}
</script>
