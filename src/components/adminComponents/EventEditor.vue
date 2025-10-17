<template>
  <h1>Modifier la présentation de la manifestation</h1>
  <Editor v-model="manifestContent" />
  <div style="margin-top: 12px">
    <Button label="Sauvegarder" icon="pi pi-save" @click="() => { }" />
  </div>
  <div class="preview" style="margin-top: 16px">
    <h3>Aperçu</h3>
    <div v-html="manifestContent" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Editor from 'primevue/editor';
import { Button } from 'primevue';

// Manifestation editor state
const manifestContent = ref('<h3>Titre de la manifestation</h3><p>Description...</p>')

</script>
