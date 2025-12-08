<template>
  <Card :class="props?.class ? props.class : ''">
    <template #content>
      <div id="map" :class="'h-[90vh] w-[90vw] ' + classSize"></div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import Card from 'primevue/card'
import { displayLocations, refreshLocations, setupMap } from '@/utils/map.utils'
import { useActivityStore } from '@/stores/activities'
import { useRoute } from 'vue-router'

const activityStore = useActivityStore()

const props = defineProps({
  displayMode: { type: String, required: true },
  class: { type: String, required: false },
  classSize: { type: String, required: true },
})

const emit = defineEmits(['changeSelectedLocation'])

onMounted(async () => {
  // watchers must stay before all await keyWord in onMounted
  const route = useRoute()
  watch(
    () => activityStore.activities,
    () => {
      refreshLocations(map, emit, props.displayMode, route)
    },
  )

  const map = setupMap('map')
  await displayLocations(map, props.displayMode, emit, route)

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
