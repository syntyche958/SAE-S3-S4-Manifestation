<script setup>
import NewProviderForm from './homeComponents/NewProviderForm.vue';
import ContactForm from './providerComponents/ContactForm.vue';
</script>

<template>
  <div id="footer">
    <ContactForm />
    <NewProviderForm />
  </div>
</template>

<style scoped>
#footer {
  background-color: aquamarine;
  width: 100%;
  height: 30vh;
}
</style>
