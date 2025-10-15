<template>
  <div class="locale-changer">
    <Select v-model="$i18n.locale" :options="$i18n.availableLocales" size="small">
    </Select>
  </div>
</template>

<script setup>
import { Select } from 'primevue';
</script>
