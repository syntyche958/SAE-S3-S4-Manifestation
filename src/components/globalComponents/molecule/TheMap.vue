<template>
  <Card
    v-if="props.withCard"
    :class="(props?.class ? props.class : '') + ' rounded-2xl overflow-hidden shadow-xl'"
  >
    <template #content>
      <div :id="props.id" :class="'rounded-2xl overflow-hidden max-w-full ' + classSize"></div>
    </template>
  </Card>
  <div v-else :class="props?.class ? props.class : ''">
    <div :id="props.id" :class="'rounded-2xl overflow-hidden max-w-full ' + classSize"></div>
  </div>
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
  selectedLocationId: { type: [Number, String], required: false },
  visitorDateHour: { type: String, required: false, default: undefined },
  visitorActivityId: { type: [Number, String, null], required: false, default: null },
  withCard: { type: Boolean, required: false, default: true },
  class: { type: String, required: false },
  classSize: { type: String, required: true },
})

const emit = defineEmits(['changeSelectedLocation'])

onMounted(() => {
  const route = useRoute()
  watch(
    () => activityStore.activities,
    () => {
      refreshLocations(
        map,
        emit,
        props.displayMode,
        route,
        props.selectedLocationId,
        props.visitorDateHour,
        props.visitorActivityId,
      )
    },
  )

  watch(
    () => [props.visitorDateHour, props.visitorActivityId],
    () => {
      refreshLocations(
        map,
        emit,
        props.displayMode,
        route,
        props.selectedLocationId,
        props.visitorDateHour,
        props.visitorActivityId,
      )
    },
  )

  const map = setupMap(props.id)
  displayLocations(
    map,
    props.displayMode,
    emit,
    route,
    props.selectedLocationId,
    props.visitorDateHour,
    props.visitorActivityId,
  )

  const observer = new ResizeObserver(() => {
    map.invalidateSize()
  })
  observer.observe(document.getElementById(props.id))
})
</script>
