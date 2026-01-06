<template>
  <div class="card">
    <FileUpload
      ref="fileUploadRef"
      name="demo[]"
      :customUpload="true"
      @uploader="uploadAllFiles"
      @select="onFileSelect"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
    >
      <template #empty>
        <span>
          Déposez ici (drag and drop) les images que vous souhaitez rendre visibles dans le
          carroussel
        </span>
      </template>
    </FileUpload>

    <div v-if="selectedFiles.length > 0" class="mt-4">
      <h3>Images sélectionnées :</h3>
      <div class="image-grid">
        <div v-for="(fileData, index) in selectedFiles" :key="index" class="image-item">
          <img :src="fileData.preview" :alt="fileData.name" class="image-thumbnail" />
          <Button
            icon="pi pi-times"
            class="delete-btn"
            severity="danger"
            size="small"
            @click="removeSelectedFile(index)"
          />
        </div>
      </div>
      <Button
        label="Uploader les images"
        icon="pi pi-upload"
        class="mt-3"
        @click="uploadAllFiles"
        :loading="isUploading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProviderStore } from '@/stores/providers'
import { displayErrToast } from '@/utils/toast.utils'
import { FileUpload, Button } from 'primevue'

const route = useRoute()
const providerStore = useProviderStore()
const fileUploadRef = ref(null)
const selectedFiles = ref([])
const isUploading = ref(false)

const onFileSelect = (event) => {
  const files = event.files

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file: file,
        name: file.name,
        preview: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeSelectedFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const uploadAllFiles = async () => {
  if (selectedFiles.value.length === 0) {
    displayErrToast('Aucune image sélectionnée')
    return
  }
  isUploading.value = true
  const providerId = Number.parseInt(route.params.provider_id)

  try {
    for (const fileData of selectedFiles.value) {
      console.log(fileData.preview)
      await providerStore.uploadProviderImage(providerId, {
        url: fileData.preview,
        name: fileData.name,
      })
    }

    selectedFiles.value = []
    if (fileUploadRef.value) {
      fileUploadRef.value.clear()
    }
  } catch (error) {
    console.error('Erreur upload:', error)
    displayErrToast("Erreur lors de l'upload")
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-item {
  position: relative;
}

.image-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
