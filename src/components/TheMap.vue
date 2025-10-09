<template>
  <Card>
    <template #content>
      <div id="map"></div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted } from 'vue'
import Card from 'primevue/card'
import { displayLocations, setupMap } from '@/utils/map.utils'

const props = defineProps({
  displayMode: { type: String, required: true },
})

onMounted(async () => {
  // Map setup
  var map = setupMap('map')
  await displayLocations(map, props.displayMode)
})
</script>

<style scoped>
#map {
  height: 80vh;
  width: 50vw;
}

@media only screen and (max-width: 950px) {
  #map {
    height: 90vh;
    width: 90vw;
  }
}
</style>
