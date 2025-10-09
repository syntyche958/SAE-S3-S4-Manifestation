<template>
  <div :id="'map-and-provider-section'">
    <TheMap :display-mode="MapMode.VISITOR" />
    <ProviderTable />
  </div>
</template>

<script setup>
import TheMap from './TheMap.vue';
import ProviderTable from './ProviderTable.vue';
import { MapMode } from '@/enums/Map.enums';
</script>

<style scoped>
#map-and-provider-section {
  display: flex;
  justify-content: space-between;
}

@media only screen and (max-width: 950px) {
  #map-and-provider-section {
    display: flex;
    flex-direction: column;
  }
}
</style>
