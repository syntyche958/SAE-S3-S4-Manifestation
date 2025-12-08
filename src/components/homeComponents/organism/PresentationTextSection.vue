<template>
  <section
    id="presentation-text"
    :class="
      'h-screen w-full flex items-center justify-center bg-white px-6 ' +
      (isPreview ? 'border-black border-solid border' : '')
    "
  >
    <div class="max-w-6xl text-justify quill-content-display" v-html="presentationStore.big"></div>
  </section>
</template>

<script setup>
import { usePresentationStore } from '@/stores/presentation'

const presentationStore = usePresentationStore()
defineProps({
  isPreview: { type: Boolean, required: false, default: false },
})
</script>
