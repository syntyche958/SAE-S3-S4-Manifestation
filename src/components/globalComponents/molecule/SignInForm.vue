<template>
  <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
    <h2>{{ $t('message.signIn') }}</h2>
    <div class="flex flex-col gap-2">
      <label for="username">Mail</label>
      <InputText id="username" type="email" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="password">{{ $t('message.password') }}</label>
      <InputText id="password" type="password" />
    </div>
    <div class="flex">
      <Button label="Login" icon="pi pi-user" class="w-full max-w-[17.35rem] mx-auto"></Button>
    </div>
  </div>
</template>
<script setup>
import { InputText, Button } from 'primevue'
</script>
