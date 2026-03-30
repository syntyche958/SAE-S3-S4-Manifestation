<template>
  <span :class="capsuleClass" class="rounded-full border px-2 py-1 text-xs">
    {{ hour }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { ActivitySpotStatusEnum } from '@/enums/ActivitySpotStatus.enum'

const props = defineProps({
  hour: { type: String, required: true },
  status: {
    type: String,
    required: true,
    validator: (value) =>
      [ActivitySpotStatusEnum.AVAILABLE, ActivitySpotStatusEnum.PENDING, ActivitySpotStatusEnum.OCCUPIED].includes(value),
  },
})

const capsuleClass = computed(() => {
  if (props.status === ActivitySpotStatusEnum.AVAILABLE)
    return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
  if (props.status === ActivitySpotStatusEnum.PENDING)
    return 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300'
  return 'border-rose-500/30 bg-rose-500/15 text-rose-300'
})
</script>
