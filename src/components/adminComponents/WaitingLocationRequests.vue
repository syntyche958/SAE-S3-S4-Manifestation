<template>
  <div v-if="locationRequestedBy.length > 0" class="mt-6 flex flex-col gap-3">
    <h2 class="mb-0!">Demande en attente :</h2>
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

      <!-- Column with button  -->
      <Column field="id" header="" style="min-width: 12rem">
        <template #body="{ data }">
          <Button
            type="button"
            label="Accepter la demande"
            @click="emit('set-activity-location', data.id)"
            size="small"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { Column, DataTable, Button } from 'primevue'
import { useProviderStore } from '@/stores/providers'
import { useActivityStore } from '@/stores/activities'

const activityStore = useActivityStore()
const providerStore = useProviderStore()

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['set-activity-location'])

const locationRequestedBy = computed(() => {
  return activityStore.activities.filter((a) => a.requestedLocationId == props.selectedLocationId)
})
</script>
