<template>
  <span
    :class="[capsuleClass, selectedClass, { 'cursor-pointer': selectable, 'cursor-default': !selectable }]"
    role="button"
    :tabindex="selectable ? 0 : -1"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
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
      [
        ActivitySpotStatusEnum.PROVIDER_FREE,
        ActivitySpotStatusEnum.PROVIDER_SELF,
        ActivitySpotStatusEnum.PROVIDER_PENDING,
        ActivitySpotStatusEnum.PROVIDER_OTHER,
        ActivitySpotStatusEnum.ADMIN_FREE,
        ActivitySpotStatusEnum.ADMIN_PENDING,
        ActivitySpotStatusEnum.ADMIN_RESERVED,
      ].includes(value),
  },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

const capsuleClass = computed(() => {
  if (
    props.status === ActivitySpotStatusEnum.PROVIDER_FREE ||
    props.status === ActivitySpotStatusEnum.ADMIN_FREE
  )
    return 'rounded-full border px-2 py-1 text-xs border-sky-500/40 bg-sky-500/15 text-sky-300'
  if (
    props.status === ActivitySpotStatusEnum.PROVIDER_SELF ||
    props.status === ActivitySpotStatusEnum.ADMIN_RESERVED
  )
    return 'rounded-full border px-2 py-1 text-xs border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
  if (
    props.status === ActivitySpotStatusEnum.PROVIDER_PENDING ||
    props.status === ActivitySpotStatusEnum.ADMIN_PENDING
  )
    return 'rounded-full border px-2 py-1 text-xs border-amber-500/40 bg-amber-500/15 text-amber-300'
  return 'rounded-full border px-2 py-1 text-xs border-rose-500/40 bg-rose-500/15 text-rose-300'
})

const selectedClass = computed(() =>
  props.selected && props.selectable
    ? 'font-bold ring-2 ring-white/45 ring-offset-2 ring-offset-[#1a1a1a]'
    : '',
)

function onClick() {
  if (!props.selectable) return
  emit('toggle')
}
</script>
