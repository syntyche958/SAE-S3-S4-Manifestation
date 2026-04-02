<template>
  <h2 v-if="displayTitle">{{ $t('message.characteristicsOfTheLocation') + ' :' }}</h2>
  <div><b>{{ $t('message.surface') }}</b> : {{ selectedLocation.surfaceArea }}</div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  selectedLocation: { required: true },
  displayTitle: { type: Boolean, required: true },
})
</script>
