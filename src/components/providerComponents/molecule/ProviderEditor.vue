<template>
  <Editor v-model="description" editorStyle="min-height: 18rem" class="provider-editor">
    <template v-slot:toolbar>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
        <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
        <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-header" v-tooltip.bottom="$t('message.title')">
          <option selected></option>
          <option value="1">{{ $t('message.title1') }}</option>
          <option value="2">{{ $t('message.title2') }}</option>
          <option value="3">Titre 3</option>
          <option value="4">Titre 4</option>
          <option value="5">Titre 5</option>
          <option value="6">Titre 6</option>
        </select>
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
    <Button :label="$t('message.save')" icon="pi pi-save" @click="saveDescription()" :loading="saving" :disabled="saving" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from 'primevue/editor'
import { Button } from 'primevue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const providerStore = useProviderStore()
const route = useRoute()

const description = ref()

const providerId = Number.parseInt(route.params.provider_id)

const emit = defineEmits(['hide-dialog'])

watch(
  () => [locale.value, providerStore.providers],
  () => {
    const provider = providerStore.providers.find((p) => p.id === providerId)
    if (locale.value === 'en') {
      description.value = provider?.descriptionEn || provider?.description || ''
    } else {
      description.value = provider?.descriptionFr || provider?.description || ''
    }
  },
  { immediate: true, deep: true },
)

const saving = ref(false)

const saveDescription = async () => {
  saving.value = true
  await providerStore.updateProviderDescription(providerId, description.value)
  saving.value = false
  emit('hide-dialog')
}
</script>

<style scoped>
.provider-editor {
  width: 100%;
  max-width: 100%;
}
</style>
