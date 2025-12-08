<template>
  <!-- <Divider type="solid" /> -->
  <div class="w-full bg-transparent flex justify-center gap-2 h-[10vh] items-center">
    <ContactForm />
    <NewProviderForm />
    <SatisfactionForm />
  </div>
</template>

<script setup>
import NewProviderForm from '@/components/homeComponents/NewProviderForm.vue'
import ContactForm from '@/components/providerComponents/ContactForm.vue'
import SatisfactionForm from './homeComponents/SatisfactionForm.vue'
</script>
