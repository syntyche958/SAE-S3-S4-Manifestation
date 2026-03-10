<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="signin-mail-input" class="text-xs font-bold text-surface-400 uppercase ml-1">Email</label>
        <InputText id="signin-mail-input" type="email" v-model="mail" fluid class="!rounded-xl border-surface-200/20 focus:border-emerald-500 bg-surface-100/10 text-white" placeholder="votre@email.fr" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="signin-password-input" class="text-xs font-bold text-surface-400 uppercase ml-1">{{ $t('message.password') }}</label>
        <InputText id="signin-password-input" type="password" v-model="password" fluid class="!rounded-xl border-surface-200/20 focus:border-emerald-500 bg-surface-100/10 text-white" placeholder="••••••••" />
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-2">
      <Button
        label="Créer mon compte"
        icon="pi pi-user-plus"
        fluid
        class="!rounded-xl py-3 font-bold"
        severity="emerald"
        @click="signin"
        v-ripple
      />
      <p class="text-[10px] text-surface-400 text-center px-4 leading-relaxed mt-2">
        En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>
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
