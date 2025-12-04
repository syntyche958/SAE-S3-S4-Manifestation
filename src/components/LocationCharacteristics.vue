<template>
  <h2 v-if="displayTitle">Caractéristiques de l'emplacement :</h2>
  <div><b>Surface</b> : {{ selectedLocation.surfaceArea }}</div>
  <div><b>Eau</b> : {{ selectedLocation.water ? 'Oui' : 'Non' }}</div>
  <div><b>Electricité</b> : {{ selectedLocation.electricity ? 'Oui' : 'Non' }}</div>
</template>

<script setup>
defineProps({
  selectedLocation: { required: true },
  displayTitle: { type: Boolean, required: true },
})
</script>
