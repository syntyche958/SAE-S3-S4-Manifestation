<template>
  <h2>{{ $t('message.modifyPresentationText') }}</h2>
  <Editor v-model="smallText">
    <template v-slot:toolbar>
      <span class="ql-formats">
        <select class="ql-header">
          <option value="1">{{ $t('message.title1') }}</option>
          <option value="2">{{ $t('message.title2') }}</option>
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
      @click="onSave"
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
import { ref, watch } from 'vue'
import Editor from 'primevue/editor'
import { Button, Dialog } from 'primevue'
import { usePresentationStore } from '@/stores/presentation'
import PresentationSection from '@/components/homeComponents/organism/PresentationSection.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const smallText = ref('')
const smallTextPreviewVisible = ref(false)
const presentationStore = usePresentationStore()

watch(
  () => [locale.value, presentationStore.small, presentationStore.smallFr, presentationStore.smallEn],
  () => {
    smallText.value = locale.value === 'en'
      ? (presentationStore.smallEn || presentationStore.small)
      : (presentationStore.smallFr || presentationStore.small)
  },
  { immediate: true },
)

async function onSave() {
  await presentationStore.persistPresentation({ small: smallText.value })
}
</script>
