<template>
  <h1>Modifier votre texte de présentation : </h1>
  <Editor v-model="description">
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
    <Button
      :label="$t('message.save')"
      icon="pi pi-save"

      @click="descriptionStore.updateProviderDescription(description)"
    />
    <Button
      :label="$t('message.preview')"
      variant="outlined"
      severity="secondary"
      @click="descriptionPreviewVisible = true"
    ></Button>
  </div>

  <Dialog
    v-model:visible="descriptionPreviewVisible"
    maximizable
    modal
    header="Apercu page de présentation"
    :style="{ width: '90%' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
  </Dialog>
</template>

<script setup>
import {ref, watchEffect} from 'vue'
import Editor from 'primevue/editor'
import { Button, Dialog } from 'primevue'
import { useDescriptionStore } from '@/stores/providerDescription.js'
import {useRoute} from "vue-router";

const route = useRoute()
const description = ref('')
const descriptionPreviewVisible = ref(false)
const descriptionStore = useDescriptionStore()

watchEffect(
  async () =>
    (description.value = await descriptionStore.getProviderDescription(
      Number.parseInt(route.params.provider_id),
    )),
)

</script>
