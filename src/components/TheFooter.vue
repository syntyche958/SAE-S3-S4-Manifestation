<template>
  <div class="w-full">
    <Divider type="solid" />
    <div class="flex justify-center gap-2 mb-4">
      <ContactForm />
      <NewProviderForm />
    </div>
  </div>
</template>

<script setup>
import { Divider } from 'primevue'

import NewProviderForm from '@/components/homeComponents/NewProviderForm.vue'
import ContactForm from '@/components/providerComponents/ContactForm.vue'
</script>
