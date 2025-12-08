<template>
  <h2 v-if="displayTitle">{{ $t('message.characteristicsOfTheLocation') + ' :' }}</h2>
  <div><b>Surface</b> : {{ selectedLocation.surfaceArea }}</div>
  <div>
    <b>{{ $t('message.water') }}</b> :
    {{ selectedLocation.water ? $t('message.yes') : $t('message.no') }}
  </div>
  <div>
    <b>{{ $t('message.electricity') }}</b> :
    {{ selectedLocation.electricity ? $t('message.yes') : $t('message.no') }}
  </div>
</template>

<script setup>
defineProps({
  selectedLocation: { required: true },
  displayTitle: { type: Boolean, required: true },
})
</script>
