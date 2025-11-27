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
        <div>Surface : {{ selectedLocation.surfaceArea }}</div>
        <div>Electricité: {{ selectedLocation.electricity == true ? 'oui' : 'non' }}</div>
        <div>Eau: {{ selectedLocation.water == true ? 'oui' : 'non' }}</div>
        <!-- TODO : Afficher les demandes dans la partie admin en enlevant le tabs juste tout mettre en colonne avec un tableau liste des demandes avec un bouton 'accepter' -->
        <!-- TODO : Empecher de demander un emplacement quand un lui est déjà assigné ! -->
        <Button
          v-if="isAlreadyAsked"
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

const onChangeSelectedLocation = (locationId) => {
  selectedLocationId.value = locationId
}

function askLocation() {
  const currentActivityId = Number(route.params.activity_id)
  activityStore.updateRequestedLocationId(currentActivityId, selectedLocationId.value)
}
</script>
