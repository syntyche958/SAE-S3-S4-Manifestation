<template>
  <div class="flex gap-6">
    <!-- Left panel -->
    <TheMap
      :display-mode="MapModeEnum.PROVIDER"
      @change-selected-location="onChangeSelectedLocation"
      class="w-fit"
    />

    <!-- Right panel -->
    <Card v-if="selectedLocation != null">
      <template #title>Caractéristiques de l'emplacement séléctionné</template>
      <template #content>
        <LocationCharacteristics :selected-location="selectedLocation" />
        <Button
          v-if="isActivyLocationAlreadySet"
          label="Votre activité a déjà un emplacement reservé"
          severity="info"
          variant="text"
          disabled />
        <Button
          v-else-if="isAlreadyAsked"
          label="Demande déjà enregistré"
          severity="info"
          variant="text"
          disabled />
        <Button
          v-else-if="isAlreadyTaken"
          label="Emplacement déjà réservé"
          severity="danger"
          variant="text"
          disabled />
        <Button v-else label="Demander l'emplacement" @click="askLocation"></Button
      ></template>
    </Card>
    <Card v-else
      ><template #title> Aucun emplacement séléctionné</template
      ><template #content
        >Cliquer sur un emplacement sur la carte pour le séléctionner</template
      ></Card
    >
  </div>
</template>

<script setup>
import { Button, Card } from 'primevue'
import { MapModeEnum } from '@/enums/Map.enums'
import TheMap from '@/components/TheMap.vue'
import { computed, ref } from 'vue'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useRoute } from 'vue-router'
import LocationCharacteristics from '../LocationCharacteristics.vue'

const locationStore = useLocationStore()
const activityStore = useActivityStore()
const route = useRoute()

const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)

const isAlreadyAsked = computed(() => {
  const currentActivityId = Number(route.params.activity_id)
  return activityStore.get(currentActivityId).requestedLocationId === selectedLocationId.value
})

const isAlreadyTaken = computed(() => {
  return (
    activityStore.activities.filter((a) => a.locationId === selectedLocationId.value).length != 0
  )
})

const isActivyLocationAlreadySet = computed(() => {
  const currentActivityId = Number(route.params.activity_id)
  return activityStore.get(currentActivityId).locationId != undefined
})

const onChangeSelectedLocation = (locationId) => {
  selectedLocationId.value = locationId
}

function askLocation() {
  const currentActivityId = Number(route.params.activity_id)
  activityStore.updateRequestedLocationId(currentActivityId, selectedLocationId.value)
}
</script>
