<template>
  <h1>Modifier le texte de présentation de l'évenement</h1>
  <Editor v-model="smallText">
    <template v-slot:toolbar>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
        <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
        <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Clean'" class="ql-clean"></button>
      </span>
    </template>
  </Editor>
  <div style="margin-top: 12px">
    <Button label="Sauvegarder" icon="pi pi-save" @click="presentationStore.updateSmallText(smallText)" />
    <Button label="Aperçu" variant="outlined" severity="secondary" @click="smallTextPreviewVisible = true"></Button>
  </div>

  <Dialog v-model:visible="smallTextPreviewVisible" maximizable modal header="Apercu page de présentation"
    :style="{ width: '90%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <PresentationSection :preview="true" />
  </Dialog>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import Editor from 'primevue/editor';
import { Button, Dialog } from 'primevue';
import { usePresentationStore } from '@/stores/presentation';
import PresentationSection from '../homeComponents/PresentationSection.vue';

const smallText = ref("")
const smallTextPreviewVisible = ref(false)
const presentationStore = usePresentationStore()

onMounted(() => {
  smallText.value = presentationStore.small
})
</script>
