

<template>
  <DataTable :value="sessions" tableStyle="min-width: 50rem">
    <!-- input de date-->
    <Column field="beginingDate" header="Date">
      <template #body="slotProps">
        <div class="flex flex-column gap-2">
          <div class="flex align-items-center">
            <RadioButton
              :inputId="`date-${slotProps.data.id}-2026-05-28`"
              v-model="slotProps.data.beginingDate"
              value="2026-05-28"
            />
            <label
              :for="`date-${slotProps.data.id}-2026-05-28`"
              class="ml-2 cursor-pointer"
            >
              28 mai 2026
            </label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              :inputId="`date-${slotProps.data.id}-2026-05-29`"
              v-model="slotProps.data.beginingDate"
              value="2026-05-29"
            />
            <label
              :for="`date-${slotProps.data.id}-2026-05-29`"
              class="ml-2 cursor-pointer"
            >
              29 mai 2026
            </label>
          </div>
        </div>
      </template>
    </Column>
    <!-- input de heure-->
    <Column field="beginingHour" header="Heure">
      <template #body="slotProps">
        <input
          type="time"
          v-model="slotProps.data.beginingHour"
          class="p-inputtext p-component w-full"
        />
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
import { InputNumber, Button, DataTable, Column, RadioButton } from 'primevue'

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
