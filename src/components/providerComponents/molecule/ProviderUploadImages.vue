<template>
  <Card>
    <template #content>
      <FileUpload
        ref="fileUploadRef"
        name="demo[]"
        :customUpload="true"
        @uploader="uploadAllFiles"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
        :showCancelButton="true"
      >
        <template #empty>
          <span>
            {{ $t('message.dropImages') }}
          </span>
        </template>
      </FileUpload>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'
import { displayErrToast } from '@/utils/toast.utils'
import { FileUpload, Card } from 'primevue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const providerStore = useProviderStore()
const fileUploadRef = ref(null)

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const uploadAllFiles = async (event) => {
  const files = event?.files ?? []
  if (files.length === 0) {
    displayErrToast(t('message.noImagesSelected'))
    return
  }
  const providerId = Number.parseInt(route.params.provider_id, 10)

  try {
    for (const file of files) {
      const url = await readFileAsDataUrl(file)
      await providerStore.uploadProviderImage(providerId, {
        url,
        name: file.name,
      })
    }

    if (fileUploadRef.value) {
      fileUploadRef.value.clear()
    }
  } catch (error) {
    console.error('Erreur upload:', error)
    displayErrToast(t('message.imageUploadFailed'))
  }
}
</script>

<style scoped>
/* Badge orange « Pending » du FileUpload PrimeVue — masqué pour cette modale */
:deep(.p-fileupload-file-badge) {
  display: none;
}
</style>

