<script setup>
import { Divider } from 'primevue'

import NewProviderForm from './homeComponents/NewProviderForm.vue'
import ContactForm from './providerComponents/ContactForm.vue'
</script>

<template>
  <div class="w-full">
    <Divider type="solid" />
    <div class="flex justify-center gap-2 mb-4">
      <ContactForm />
      <NewProviderForm />
    </div>
  </div>
</template>
