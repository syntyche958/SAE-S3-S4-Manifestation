<template>
  <div :style="{ 'display': 'flex', 'justify-content': 'space-between' }">
    <TheMap />
    <ProviderTable />
  </div>

</template>

<script setup>
import TheMap from './TheMap.vue';
import ProviderTable from './ProviderTable.vue';
</script>
