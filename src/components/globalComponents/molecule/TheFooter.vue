<template>
  <!-- <Divider type="solid" /> -->
  <div class="w-full bg-transparent flex justify-center gap-2 h-[6vh] items-center">
    <ContactForm />
    <NewProviderForm />
    <SatisfactionForm />
  </div>
</template>

<script setup>
import NewProviderForm from '@/components/homeComponents/molecule/NewProviderForm.vue'
import ContactForm from '@/components/activityComponents/molecule/ContactForm.vue'
import SatisfactionForm from '@/components/homeComponents/molecule/SatisfactionForm.vue'
</script>
