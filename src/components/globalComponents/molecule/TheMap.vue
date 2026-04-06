<template>
  <Card v-if="props.withCard" :class="(props?.class ? props.class : '') + ' rounded-2xl overflow-hidden shadow-xl'">
    <template #content>
      <div :id="props.id" :class="'rounded-2xl overflow-hidden max-w-full ' + classSize"></div>
    </template>
  </Card>
  <div v-else :class="props?.class ? props.class : ''">
    <div :id="props.id" :class="'rounded-2xl overflow-hidden max-w-full ' + classSize"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import Card from 'primevue/card'
import { displayLocations, refreshLocations, setupMap } from '@/utils/map.utils'
import { useActivityStore } from '@/stores/activities'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const activityStore = useActivityStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  id: { type: String, default: 'map' },
  displayMode: { type: String, required: true },
  selectedLocationId: { type: [Number, String], required: false },
  visitorDateHour: { type: String, required: false, default: undefined },
  withCard: { type: Boolean, required: false, default: true },
  class: { type: String, required: false },
  classSize: { type: String, required: true },
})

const emit = defineEmits(['changeSelectedLocation'])

let mapInstance = null
let resizeObserver = null
let stopActivitiesWatch = null
let stopVisitorDateWatch = null

onMounted(async () => {
  await nextTick()

  const container = document.getElementById(props.id)
  if (!container) {
    console.warn(`Map container not found for id "${props.id}".`)
    return
  }

  mapInstance = setupMap(props.id)
  displayLocations(mapInstance, {
    mapMode: props.displayMode,
    emit,
    route,
    selectedLocationId: props.selectedLocationId,
    visitorDateHour: props.visitorDateHour,
    t,
    router,
  })

  stopActivitiesWatch = watch(
    () => activityStore.activities,
    () => {
      if (!mapInstance) return
      refreshLocations(mapInstance, {
        emit,
        mapMode: props.displayMode,
        route,
        selectedLocationId: props.selectedLocationId,
        visitorDateHour: props.visitorDateHour,
        t,
        router,
      })
    },
  )

  stopVisitorDateWatch = watch(
    () => props.visitorDateHour,
    () => {
      if (!mapInstance) return
      refreshLocations(mapInstance, {
        emit,
        mapMode: props.displayMode,
        route,
        selectedLocationId: props.selectedLocationId,
        visitorDateHour: props.visitorDateHour,
        t,
        router,
      })
    },
  )

  resizeObserver = new ResizeObserver(() => {
    if (mapInstance) mapInstance.invalidateSize()
  })
  resizeObserver.observe(container)
})

onBeforeUnmount(() => {
  if (stopActivitiesWatch) stopActivitiesWatch()
  if (stopVisitorDateWatch) stopVisitorDateWatch()

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
