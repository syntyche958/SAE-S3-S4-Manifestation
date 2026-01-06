

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
  <div class="mt-4 flex justify-end">
    <Button
      icon="pi pi-plus"
      label="Ajouter une session"
      severity="secondary"
      @click="addNewSession"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/sessions.js'
import { computed, onMounted } from 'vue'
import { InputText, InputNumber, Button, DataTable, Column } from 'primevue'

const route = useRoute()
const sessionStore = useSessionStore()

const activityId = computed(() => Number.parseInt(route.params.activity_id))
const sessions = computed(() => {
  if (!sessionStore.sessions) return []
  return sessionStore.sessions.filter((s) => s.activitiesId === activityId.value)
})

async function addNewSession() {
  await sessionStore.addSession(activityId.value, '', '', 0, 0)
}

onMounted(async () => {
  if (!sessionStore.sessions || sessionStore.sessions.length === 0) {
    await sessionStore.getAllSessions()
  }
})
</script>
