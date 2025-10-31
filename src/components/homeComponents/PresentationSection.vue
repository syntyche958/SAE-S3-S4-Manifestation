<script setup>
import { usePresentationStore } from '@/stores/presentation'

const presentationStore = usePresentationStore()

const props = defineProps({
  isPreview: { type: Boolean, required: false, default: false },
})
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full">
    <img
      src="@/assets/images/main_bg.jpg.avif"
      alt="Carcassonne castle"
      class="w-full h-full object-cover"
    />
    <div class="overlay"></div>
    <h1>Carcassonne autrefois</h1>
    <div id="small-presentation" v-html="presentationStore.small" />
    <a v-if="props.isPreview" class="p-button p-component"> {{ $t('message.seeMap') }} </a>
    <a v-else href="#map" class="p-button p-component"> {{ $t('message.seeMap') }} </a>
  </div>

  <div class="relative h-screen"></div>
</template>

<style scoped>
a {
  text-decoration: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
}

h1 {
  position: absolute;
  z-index: 1;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -25%);
  color: white;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  font-size: 100px;
}

@media only screen and (max-width: 950px) {
  .image-container h1 {
    font-size: 50px;
  }
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

a {
  position: absolute;
  z-index: 1;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -90%);
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}
</style>
