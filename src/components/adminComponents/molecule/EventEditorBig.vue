<template>
  <h2 class="mt-10">{{ $t('message.modifyPresentationTextBig') }}</h2>
  <Editor v-model="bigText">
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
        <button v-tooltip.bottom="'Liste à puces'" class="ql-list" value="bullet"></button>
        <button v-tooltip.bottom="'Liste numérotée'" class="ql-list" value="ordered"></button>
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
      @click="presentationStore.updateBigText(bigText)"
    />
    <Button
      :label="$t('message.preview')"
      variant="outlined"
      severity="secondary"
      @click="bigTextPreviewVisible = true"
    ></Button>
  </div>

  <Dialog
    v-model:visible="bigTextPreviewVisible"
    maximizable
    modal
    :header="$t('message.homePagePreview')"
    :style="{ width: '90%' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    ><div class="relative">
      <PresentationTextSection :isPreview="true" /></div
  ></Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Editor from 'primevue/editor'
import { Button, Dialog } from 'primevue'
import { usePresentationStore } from '@/stores/presentation'
import PresentationTextSection from '@/components/homeComponents/organism/PresentationTextSection.vue'

const bigText = ref('')
const bigTextPreviewVisible = ref(false)
const presentationStore = usePresentationStore()

onMounted(() => {
  bigText.value = presentationStore.big
})
</script>
