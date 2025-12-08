<template>
  <div class="flex items-center mr-3">
    <Select v-model="$i18n.locale" :options="$i18n.availableLocales" size="small"> </Select>
  </div>
</template>

<script setup>
import { Select } from 'primevue'
</script>
