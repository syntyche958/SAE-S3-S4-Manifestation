<template>
  <div class="flex flex-col sm:flex-row sm:gap-4">
    <TheMap
      :display-mode="MapModeEnum.VISITOR"
      class="sm:ml-4 my-4"
      classSize="sm:h-[80vh] sm:w-[50vw]"
    />
    <ProviderTable class="h-full grow" />
  </div>
</template>

<script setup>
import TheMap from '@/components/globalComponents/molecule/TheMap.vue'
import ProviderTable from '@/components/homeComponents/molecule/ProviderTable.vue'
import { MapModeEnum } from '@/enums/Map.enums'
</script>
