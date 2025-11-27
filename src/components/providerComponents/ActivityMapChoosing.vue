<template>
  <div class="flex gap-6">
    <TheMap
      :display-mode="MapModeEnum.PROVIDER"
      @change-selected-location="
        (sl) => {
          selectedLocationId = sl
        }
      "
      class="w-fit"
    />
    <Card v-if="selectedLocation != null">
      <template #title>Caractéritiques de l'emplacement séléctionné</template>
      <template #content>
        <div>Surface : {{ selectedLocation.surfaceArea }}</div>
        <div>Electricité: {{ selectedLocation.electricity == true ? 'oui' : 'non' }}</div>
        <div>Eau: {{ selectedLocation.water == true ? 'oui' : 'non' }}</div>
        <!-- TODO : Bien faire attention: une seule demande possible par activité -->
        <!-- Donc si une autre demande existe déjà, le supprimer ! -->
        <!-- TODO : Afficher les demandes dans la partie admin en enlevant le tabs juste tout mettre en colonne avec un tableau liste des demandes avec un bouton 'accepter' -->
        <Button label="Demander l'emplacement"></Button
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

const locationStore = useLocationStore()
const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)
</script>
