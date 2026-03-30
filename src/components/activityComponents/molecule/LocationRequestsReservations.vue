<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-white/90">Demandes / réservations</h3>
      <Button icon="pi pi-plus" size="small" rounded @click="emit('start-add-row')" />
    </div>

    <div class="overflow-auto rounded-xl border border-white/10 p-2">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-white/70">
            <th class="py-1 pr-2">Jour</th>
            <th class="py-1 pr-2">Heure</th>
            <th class="py-1 pr-2">Statut</th>
            <th class="py-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isAddingRow">
            <td class="py-1 pr-2">
              <select
                :value="draftDay"
                class="p-inputtext w-full"
                @change="emit('update:draftDay', $event.target.value)"
              >
                <option v-for="d in availableDates" :key="d" :value="d">
                  {{ formatDate(d) }}
                </option>
              </select>
            </td>
            <td class="py-1 pr-2">
              <select
                :value="draftHour"
                class="p-inputtext w-full"
                @change="emit('update:draftHour', $event.target.value)"
              >
                <option v-for="h in hourOptions" :key="h" :value="h">
                  {{ h }}
                </option>
              </select>
            </td>
            <td class="py-1 pr-2">
              <span
                class="inline-flex rounded border border-yellow-500/30 bg-yellow-500/15 px-2 py-0.5 text-xs text-yellow-300"
              >
                demande
              </span>
            </td>
            <td class="py-1">
              <Button
                size="small"
                label="Ajouter"
                :disabled="hourOptions.length === 0"
                @click="emit('add-request-row')"
              />
            </td>
          </tr>

          <tr v-for="row in requestRows" :key="row.key">
            <td class="py-1 pr-2">{{ formatDate(row.day) }}</td>
            <td class="py-1 pr-2">{{ row.hour }}</td>
            <td class="py-1 pr-2">
              <span
                v-if="row.status === ActivitySpotStatusEnum.ACCEPTED"
                class="inline-flex rounded border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300"
              >
                accepté
              </span>
              <span
                v-else
                class="inline-flex rounded border border-yellow-500/30 bg-yellow-500/15 px-2 py-0.5 text-xs text-yellow-300"
              >
                demande
              </span>
            </td>
            <td class="py-1"></td>
          </tr>

          <tr v-if="!isAddingRow && requestRows.length === 0">
            <td colspan="4" class="py-3 text-center text-white/60">Aucune ligne</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Button } from 'primevue'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'

defineProps({
  availableDates: { type: Array, required: true },
  hourOptions: { type: Array, required: true },
  requestRows: { type: Array, required: true },
  isAddingRow: { type: Boolean, required: true },
  draftDay: { type: String, default: '' },
  draftHour: { type: String, default: '' },
})

const emit = defineEmits([
  'start-add-row',
  'add-request-row',
  'update:draftDay',
  'update:draftHour',
])

function formatDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
