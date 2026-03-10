<template>
  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    <span
      class="texturina-title absolute z-1 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 text-white text-center [text-shadow:0_0_10px_rgba(0,0,0,0.7)] text-5xl sm:text-8xl"
      >Carcassonne autrefois</span
    >
    <div id="small-presentation" v-html="presentationStore.small" />
    <div id="button-container">
      <a v-if="props.isPreview" class="p-button p-component !border-none !outline-none !shadow-none"> {{ $t('message.seeMap') }} </a>
      <a v-else href="#map" class="p-button p-component !border-none !outline-none !shadow-none"> {{ $t('message.seeMap') }} </a>
    </div>

    <!-- Maintain smooth transition to next section -->
    <div class="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent"></div>
  </div>

  <div class="relative h-screen"></div>
</template>

<script setup>
import { usePresentationStore } from '@/stores/presentation'

const presentationStore = usePresentationStore()

const props = defineProps({
  isPreview: { type: Boolean, required: false, default: false },
})
</script>

<style scoped>
a {
  text-decoration: none;
}

#small-presentation {
  position: absolute;
  z-index: 1;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -75%);
  color: #fafafa;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(4px);
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

#button-container {
  position: absolute;
  z-index: 1;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -90%);
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}
</style>
