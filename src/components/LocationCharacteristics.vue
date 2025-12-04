<template>
  <h2 v-if="displayTitle">Caractéristiques de l'emplacement :</h2>
  <div>Surface : {{ selectedLocation.surfaceArea }}</div>
  <div>Eau : {{ selectedLocation.water ? 'Oui' : 'Non' }}</div>
  <div>Electricité : {{ selectedLocation.electricity ? 'Oui' : 'Non' }}</div>
</template>

<script setup>
defineProps({
  selectedLocation: { required: true },
  displayTitle: { type: Boolean, required: true },
})
</script>
