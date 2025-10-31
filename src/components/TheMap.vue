<template>
  <Card :class="props?.class ? props.class : ''">
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
  class: { type: String, required: false },
})

onMounted(async () => {
  // Map setup
  const map = setupMap('map')
  await displayLocations(map, props.displayMode)

  /* Fix :
    As TheMap is in a Tab component, map is first mounted with null size
    this observer refresh the map when the size changes (when the map
    is dislpayed)
  */
  const observer = new ResizeObserver(() => {
    map.invalidateSize()
  })
  observer.observe(document.getElementById('map'))
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
