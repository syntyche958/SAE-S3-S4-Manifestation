<template>
  <Card v-if="requestRows.length > 0" class="mt-6">
    <template #content>
      <div class="flex flex-col gap-3">
        <h2 class="mb-0!">Demande en attente :</h2>
        <DataTable :value="requestRows" paginator :rows="10" dataKey="rowKey">
          <Column field="activityName" header="Activité" sortable style="min-width: 10rem" />
          <Column field="providerName" header="Prestataire" sortable style="min-width: 10rem" />
          <Column field="date" header="Date" sortable style="min-width: 8rem" />
          <Column field="hour" header="Heure" sortable style="min-width: 6rem" />
          <Column header="" style="min-width: 10rem">
            <template #body="{ data }">
              <Button
                type="button"
                label="Accepter"
                @click="
                  emit('set-activity-location', {
                    activityId: data.activityId,
                    dateHour: data.dateHour,
                  })
                "
                size="small"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
  <Message v-else severity="info">Aucune demande en attente</Message>
</template>
<script setup>
import { computed } from 'vue'
import { Column, DataTable, Button, Card, Message } from 'primevue'
import { useProviderStore } from '@/stores/providers'
import { useActivityStore } from '@/stores/activities'

const activityStore = useActivityStore()
const providerStore = useProviderStore()

const props = defineProps({
  selectedLocationId: { type: Number },
})

const emit = defineEmits(['set-activity-location', 'refuse-activity-location'])

const requestRows = computed(() => {
  const rows = []
  for (const activity of activityStore.activities) {
    for (const spot of activity.requestedSpotIds || []) {
      if (spot.locationId !== props.selectedLocationId) continue
      const [date, hour] = spot.dateHour.split('T')
      const provider = providerStore.get(activity.providerId)
      rows.push({
        rowKey: `${activity.id}-${spot.dateHour}`,
        activityId: activity.id,
        activityName: activity.name,
        providerName: provider?.name || '—',
        date,
        hour,
        dateHour: spot.dateHour,
      })
    }
  }
  return rows.sort((a, b) => a.dateHour.localeCompare(b.dateHour))
})
</script>
