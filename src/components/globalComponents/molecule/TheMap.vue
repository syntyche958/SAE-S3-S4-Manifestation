<template>
  <Card :class="(props?.class ? props.class : '') + ' rounded-2xl overflow-hidden shadow-xl'">
    <template #content>
      <div :id="props.id" :class="'h-[90vh] w-[90vw] rounded-2xl overflow-hidden ' + classSize"></div>
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
  id: { type: String, default: 'map' },
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

  const map = setupMap(props.id)
  displayLocations(map, props.displayMode, emit, route)

  const observer = new ResizeObserver(() => {
    map.invalidateSize()
  })
  observer.observe(document.getElementById(props.id))
})
</script>
