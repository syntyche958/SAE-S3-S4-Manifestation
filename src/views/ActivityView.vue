<template>
  <div
    v-if="
      authStore.user?.type === UserTypeEnum.VISITOR ||
      (authStore.user?.type === UserTypeEnum.PROVIDER &&
        route.params.provider_id != authStore.user?.id)
    "
  >
    <ActivityPresentation />
  </div>

  <div v-else>
    <Tabs value="0">
      <TabList>
        <Tab value="0"><i class="pi pi-file-edit"></i><span> Apparence de la page</span></Tab>
        <Tab value="1"><i class="pi pi-file-edit"></i><span> Choix de l'emplacement</span></Tab>
        <Tab value="2"><i class="pi pi-cog"></i><span> Configuration</span></Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <ActivityPresentation />
        </TabPanel>
        <TabPanel value="1">
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
        </TabPanel>
        <TabPanel value="2">
          <ActivityConfiguration />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'
import TheMap from '@/components/TheMap.vue'
import { MapModeEnum } from '@/enums/Map.enums'
import { useLocationStore } from '@/stores/locations'
import { Card } from 'primevue'
import ActivityPresentation from '@/components/providerComponents/ActivityPresentation.vue'
import ActivityConfiguration from '@/components/providerComponents/ActivityConfiguration.vue'

const authStore = useAuthStore()
const locationStore = useLocationStore()
const route = useRoute()

const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)
</script>
