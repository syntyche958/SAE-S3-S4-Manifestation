<template>
  <div>Surface : {{ selectedLocation.surfaceArea }}</div>
  <div>Eau : {{ selectedLocation.water ? 'Oui' : 'Non' }}</div>
  <div>Electricité : {{ selectedLocation.electricity ? 'Oui' : 'Non' }}</div>
</template>

<script setup>
defineProps({
  selectedLocation: { required: true },
})
</script>
