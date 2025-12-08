<template>
  <div class="card">
    <FileUpload
      name="demo[]"
      url="/api/upload"
      @upload="onAdvancedUpload($event)"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
    >
      <template #empty>
        <span
          >Déposez ici (drag and drop) les images que vous souhaitez rendre visibles dans le
          caroussel</span
        >
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import { displaySuccessToast } from '@/utils/toast.utils'
import { FileUpload } from 'primevue'

const onAdvancedUpload = () => {
  displaySuccessToast('File uploaded')
}
</script>
