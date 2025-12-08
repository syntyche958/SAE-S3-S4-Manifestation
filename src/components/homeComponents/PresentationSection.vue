<template>
  <div class="absolute top-0 left-0 w-full h-full">
    <video class="w-full h-full object-cover" autoplay loop muted>
      <source src="@/assets/drone_video.mp4" />
    </video>
    <div class="absolute top-0 left-0 w-full h-full bg-black/50"></div>
    <span
      class="texturina-title absolute z-1 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 text-white text-center pointer-events-none [text-shadow:0_0_10px_rgba(0,0,0,0.7)] text-5xl sm:text-8xl"
      >Carcassonne autrefois</span
    >
    <div id="small-presentation" v-html="presentationStore.small" />
    <div id="button-container">
      <!-- <a href="#presentation-text" class="p-button p-component">Plus d'informations</a> -->
      <a v-if="props.isPreview" class="p-button p-component"> {{ $t('message.seeMap') }} </a>
      <a v-else href="#map" class="p-button p-component"> {{ $t('message.seeMap') }} </a>
    </div>
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
  color: white;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  pointer-events: none;
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
