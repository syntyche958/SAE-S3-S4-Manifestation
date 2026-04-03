<template>
  <div class="flex items-center mr-3">
    <Select v-model="locale" :options="availableLocales" size="small" />
  </div>
</template>

<script setup>
import { Select } from 'primevue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()
</script>
