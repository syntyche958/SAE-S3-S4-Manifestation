<template>
  <Card>
    <template #content>
      <DataTable :value="sessions" tableStyle="min-width: 50rem">
        <!-- input de date-->
        <Column field="beginingDate" :header="$t('message.date')">
          <template #body="slotProps">
            <div class="flex flex-column gap-2">
              <div v-for="eventDay in EVENT_DAYS" :key="eventDay" class="flex align-items-center">
                <RadioButton
                  :inputId="`date-${slotProps.data.id}-${eventDay}`"
                  v-model="slotProps.data.beginingDate"
                  :value="eventDay"
                />
                <label :for="`date-${slotProps.data.id}-${eventDay}`" class="ml-2 cursor-pointer">
                  {{ formatEventDay(eventDay) }}
                </label>
              </div>
            </div>
          </template>
        </Column>
        <!-- input de heure-->
        <Column field="beginingHour" :header="$t('message.time')">
          <template #body="slotProps">
            <input
              type="time"
              v-model="slotProps.data.beginingHour"
              class="p-inputtext p-component w-full"
            />
          </template>
        </Column>
        <Column field="duration" :header="$t('message.duration')">
          <template #body="slotProps">
            <InputNumber v-model="slotProps.data.duration" fluid />
          </template>
        </Column>
        <Column field="nbPlace" :header="$t('message.places')">
          <template #body="slotProps">
            <InputNumber v-model="slotProps.data.nbPlace" fluid />
          </template>
        </Column>
        <Column :header="$t('message.actions')">
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
          :label="$t('message.addSession')"
          severity="secondary"
          @click="addNewSession"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/sessions.js'
import { computed, onMounted } from 'vue'
import { InputNumber, Button, DataTable, Column, RadioButton, Card } from 'primevue'
import { useI18n } from 'vue-i18n'
import { EVENT_DAYS } from '@/constants/event.constants'

useI18n()
const route = useRoute()
const sessionStore = useSessionStore()

const activityId = computed(() => Number.parseInt(route.params.activity_id))
const sessions = computed(() => {
  if (!sessionStore.sessions) return []
  return sessionStore.sessions.filter((s) => s.activityId === activityId.value)
})

async function addNewSession() {
  await sessionStore.addSession(activityId.value, '2026-05-28', '09:00', 60, 10)
}

function formatEventDay(day) {
  const [y, m, d] = String(day).split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  if (!sessionStore.sessions || sessionStore.sessions.length === 0) {
    await sessionStore.getAllSessions()
  }
})
</script>
