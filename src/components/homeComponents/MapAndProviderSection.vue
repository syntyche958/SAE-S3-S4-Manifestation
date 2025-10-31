<template>
  <div class="flex flex-col sm:flex-row sm:gap-4">
    <TheMap :display-mode="MapModeEnum.VISITOR" class="sm:ml-4 my-4" />
    <ProviderTable />
  </div>
</template>

<script setup>
import TheMap from '@/components/TheMap.vue'
import ProviderTable from '@/components/homeComponents/ProviderTable.vue'
import { MapModeEnum } from '@/enums/Map.enums'
</script>
