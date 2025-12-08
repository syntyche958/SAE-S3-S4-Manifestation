
<template>
  <div class="card">
    <PrimeToast />
    <PrimeFileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
      <template #empty>
        <span>Déposez ici (drag and drop) les images que vous souhaitez rendre visibles dans le caroussel</span>
      </template>
    </PrimeFileUpload>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const onAdvancedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

