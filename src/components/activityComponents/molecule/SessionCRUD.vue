

<template>
  <DataTable :value="sessions" tableStyle="min-width: 50rem">
    <Column field="beginingDate" header="Date">
      <template #body="slotProps">
        <InputText v-model="slotProps.data.beginingDate" fluid />
      </template>
    </Column>
    <Column field="beginingHour" header="Heure">
      <template #body="slotProps">
        <InputText v-model="slotProps.data.beginingHour" fluid />
      </template>
    </Column>
    <Column field="duration" header="Durée">
      <template #body="slotProps">
        <InputNumber v-model="slotProps.data.duration" fluid />
      </template>
    </Column>
    <Column field="nbPlace" header="Places">
      <template #body="slotProps">
        <InputNumber v-model="slotProps.data.nbPlace" fluid />
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          outlined
          @click="sessionStore.removeSession(slotProps.data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/sessions.js'
import { computed, onMounted } from 'vue'
import { InputText, InputNumber, Button, DataTable, Column } from 'primevue'

const route = useRoute()
const sessionStore = useSessionStore()

const activityId = computed(() => Number.parseInt(route.params.activity_id))
const sessions = computed(() => sessionStore.sessions)

onMounted(async () => {
  await sessionStore.getSessionsByActivityId(activityId.value)
})
</script>
