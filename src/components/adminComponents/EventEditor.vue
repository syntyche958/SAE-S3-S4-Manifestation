<template>
  <h2>{{ $t('message.modifyPresentationText') }}</h2>
  <Editor v-model="smallText">
    <template v-slot:toolbar>
      <span class="ql-formats">
        <select class="ql-header">
          <option value="1">Titre 1</option>
          <option value="2">Titre 2</option>
          <option selected></option>
        </select>
      </span>
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
    <Button
      :label="$t('message.save')"
      icon="pi pi-save"
      @click="presentationStore.updateSmallText(smallText)"
    />
    <Button
      :label="$t('message.preview')"
      variant="outlined"
      severity="secondary"
      @click="smallTextPreviewVisible = true"
    ></Button>
  </div>

  <Dialog
    v-model:visible="smallTextPreviewVisible"
    maximizable
    modal
    :header="$t('message.homePagePreview')"
    :style="{ width: '90%' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    ><div class="relative">
      <PresentationSection :isPreview="true" /></div
  ></Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Editor from 'primevue/editor'
import { Button, Dialog } from 'primevue'
import { usePresentationStore } from '@/stores/presentation'
import PresentationSection from '../homeComponents/PresentationSection.vue'

const smallText = ref('')
const smallTextPreviewVisible = ref(false)
const presentationStore = usePresentationStore()

onMounted(() => {
  smallText.value = presentationStore.small
})
</script>
