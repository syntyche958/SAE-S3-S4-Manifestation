<template>
  <div class="my-4 flex flex-col gap-4 sm:mx-4 lg:grid lg:grid-cols-2 lg:gap-4">
    <Card class="h-[42vh] overflow-hidden lg:h-[calc(100vh-12rem)]">
      <template #content>
        <h2 class="mb-3 text-base font-semibold text-white">Filtres</h2>

        <MapVisitorFilters
          :selected-day="selectedDay"
          :selected-hour="selectedHour"
          @update:selected-day="(value) => (selectedDay = value)"
          @update:selected-hour="(value) => (selectedHour = value)"
        />

        <h2 class="mb-3 text-base font-semibold text-white">Carte</h2>
        <TheMap
          id="visitor-map"
          :display-mode="MapModeEnum.VISITOR"
          :visitor-date-hour="selectedDateHour"
          :with-card="false"
          classSize="h-[26vh] lg:h-[calc(100vh-24rem)] w-full"
        />
      </template>
    </Card>

    <div class="h-[42vh] lg:h-[calc(100vh-12rem)]">
      <ProviderTable class="h-full" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Card } from 'primevue'
import TheMap from '@/components/globalComponents/molecule/TheMap.vue'
import ProviderTable from '@/components/homeComponents/molecule/ProviderTable.vue'
import MapVisitorFilters from '@/components/homeComponents/molecule/MapVisitorFilters.vue'
import { MapModeEnum } from '@/enums/Map.enums'
import { EVENT_DAYS, EVENT_START_HOUR } from '@/constants/event.constants'

const selectedDay = ref(EVENT_DAYS[0])
const selectedHour = ref(`${String(EVENT_START_HOUR).padStart(2, '0')}:00`)

const selectedDateHour = computed(() => `${selectedDay.value}T${selectedHour.value}`)
</script>
