<template>
  <section
    id="presentation-text"
    :class="
      'min-h-screen w-full flex items-center justify-center px-6 font-medium py-20 ' +
      (isPreview ? 'border-surface-600 border-solid border' : '')
    "
  >
    <div
      class="max-w-7xl w-full text-justify quill-content-display p-8 rounded-2xl bg-surface-0/40 backdrop-blur-md border border-white/10"
      v-html="presentationStore.big"
    ></div>
  </section>
</template>

<script setup>
import { usePresentationStore } from '@/stores/presentation'

const presentationStore = usePresentationStore()
defineProps({
  isPreview: { type: Boolean, required: false, default: false },
})
</script>
<style scoped>
.quill-content-display :deep(h1) {
  color: #059669;
}

.quill-content-display :deep(strong),
.quill-content-display :deep(b) {
  color: #059669;
  font-weight: 700;
}
</style>
