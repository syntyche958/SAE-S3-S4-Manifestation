<template>
  <Editor v-model="descriptionStore.description" style="width: 220%">
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

      @click="saveDescription()"
    />
  </div>
</template>

<script setup>
import {watchEffect} from 'vue'
import Editor from 'primevue/editor'
import { Button } from 'primevue'
import { useDescriptionStore } from '@/stores/providerDescription.js'
import {useRoute} from "vue-router";

const route = useRoute()
const descriptionStore = useDescriptionStore()

function saveDescription(){
  descriptionStore.updateProviderDescription(descriptionStore.description)
  descriptionStore.closeDescriptionProvider()
}

watchEffect(async () => {
  descriptionStore.description = await descriptionStore.getProviderDescriptionFromService(
    Number.parseInt(route.params.provider_id)
  )
})

</script>
