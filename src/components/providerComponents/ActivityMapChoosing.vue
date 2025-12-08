<template>
  <div class="flex gap-6">
    <!-- Left panel -->
    <TheMap
      :display-mode="MapModeEnum.PROVIDER"
      @change-selected-location="onChangeSelectedLocation"
      class="w-fit"
      classSize="sm:h-[50vh] sm:w-[70vh]"
    />

    <!-- Right panel -->
    <Card v-if="selectedLocation != null">
      <template #title>{{ $t('message.characteristicsOfTheSelectedLocation') }}</template>
      <template #content>
        <LocationCharacteristics :selected-location="selectedLocation" :display-title="false" />
        <Button
          v-if="isActivyLocationAlreadySet"
          :label="t('message.alreadyReservedSpot')"
          severity="info"
          variant="text"
          disabled />
        <Button
          v-else-if="isAlreadyAsked"
          :label="t('message.requestAlreadyRegistered')"
          severity="info"
          variant="text"
          disabled />
        <Button
          v-else-if="isAlreadyTaken"
          :label="t('message.locationAlreadyReserved')"
          severity="danger"
          variant="text"
          disabled />
        <Button v-else :label="$t('message.requestLocation')" @click="askLocation"></Button
      ></template>
    </Card>
    <Card v-else
      ><template #title>{{ $t('message.noLocationSelected') }}</template
      ><template #content>{{ $t('message.clickOnLocation') }}</template></Card
    >
  </div>
</template>

<script setup>
import { Button, Card } from 'primevue'
import { MapModeEnum } from '@/enums/Map.enums'
import TheMap from '@/components/TheMap.vue'
import { computed, ref } from 'vue'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useRoute } from 'vue-router'
import LocationCharacteristics from '../LocationCharacteristics.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const locationStore = useLocationStore()
const activityStore = useActivityStore()
const route = useRoute()

const selectedLocationId = ref()
const selectedLocation = computed(() =>
  locationStore.locations.find((l) => l.id === selectedLocationId.value),
)

const isAlreadyAsked = computed(() => {
  const currentActivityId = Number(route.params.activity_id)
  return activityStore.get(currentActivityId).requestedLocationId === selectedLocationId.value
})

const isAlreadyTaken = computed(() => {
  return (
    activityStore.activities.filter((a) => a.locationId === selectedLocationId.value).length != 0
  )
})

const isActivyLocationAlreadySet = computed(() => {
  const currentActivityId = Number(route.params.activity_id)
  return activityStore.get(currentActivityId).locationId != undefined
})

const onChangeSelectedLocation = (locationId) => {
  selectedLocationId.value = locationId
}

function askLocation() {
  const currentActivityId = Number(route.params.activity_id)
  activityStore.updateRequestedLocationId(currentActivityId, selectedLocationId.value)
}
</script>
