<template>
  <div>
    <h2>{{ $t('message.configurationOfTheActivity') }}</h2>
    <div class="flex align-items-center gap-2">
      <session-c-r-u-d />
    </div>
  </div>
</template>
<script setup>
import SessionCRUD from '@/components/activityComponents/molecule/SessionCRUD.vue'
</script>
