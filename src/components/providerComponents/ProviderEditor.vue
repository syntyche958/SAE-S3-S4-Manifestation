<template>
  <Editor v-model="description" style="width: 220%">
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
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue'
import Editor from 'primevue/editor'
import { Button } from 'primevue'
import { useDescriptionStore } from '@/stores/providerDescription.js'
import {useRoute} from "vue-router";

const route = useRoute()
const description = ref('')
const descriptionStore = useDescriptionStore()

watchEffect(
  async () =>
    (description.value = await descriptionStore.getProviderDescription(
      Number.parseInt(route.params.provider_id),
    )),
)

</script>
