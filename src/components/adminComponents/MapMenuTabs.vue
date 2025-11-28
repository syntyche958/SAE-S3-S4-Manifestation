<template>
  <Card class="w-full">
    <template #content>
      <h1 v-if="selectedLocationId == undefined">Aucun emplacement séléctionné</h1>

      <div v-else>
        <h1>Emplacement {{ selectedLocationId }} séléctionné</h1>
        <h2>Caractéristiques de l'emplacement :</h2>
        <!-- TODO : Afficher les caracteritiques de l'emplacement (de facon sommaire) -->
        <div v-if="locationRequestedBy.length > 0">
          <h2>Demande en attente :</h2>
          <DataTable :value="locationRequestedBy" paginator :rows="10" dataKey="id">
            <!-- Columns -->
            <Column field="name" header="Activité" sortable style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.name }}
              </template>
            </Column>
            <Column field="providerId" header="Prestataire" sortable style="min-width: 12rem">
              <template #body="{ data }">
                {{ providerStore.get(data.providerId).name }}
              </template>
            </Column>

            <!-- Column « go to page »  -->
            <Column field="id" header="" style="min-width: 12rem">
              <template #body="{ data }">
                <Button
                  type="button"
                  label="Accepter la demande"
                  @click="acceptActivityLocation(data.id)"
                  size="small"
                />
              </template>
            </Column>
          </DataTable>
        </div>
        <h2>Choisir manuellement :</h2>
        <Select
          v-model="selectedActivity"
          :options="filteredActivities"
          optionLabel="name"
          placeholder="Select an activity"
          class="w-full md:w-56"
        />
        <Button
          type="button"
          label="Enregistrer"
          icon="pi pi-save"
          @click="setActivityLocation"
          :disabled="selectedActivity == undefined"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { Button, Card, Column, DataTable, Select } from 'primevue'
import { computed, ref } from 'vue'

const providerStore = useProviderStore()

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['update-selected-location-id'])

const selectedActivity = ref()
// TODO : Reset selectedActivity value when onmap selected location changes !
const activityStore = useActivityStore()

const filteredActivities = computed(() =>
  activityStore.activities.filter((a) => a.locationId == undefined),
)

const locationRequestedBy = computed(() => {
  return activityStore.activities.filter((a) => a.requestedLocationId == props.selectedLocationId)
})

const setActivityLocation = () => {
  acceptActivityLocation(selectedActivity.value.id)
}

function acceptActivityLocation(activityId) {
  activityStore.updateLocationId(activityId, props.selectedLocationId)
  emit('update-selected-location-id', undefined)
  selectedActivity.value = undefined
}
</script>
