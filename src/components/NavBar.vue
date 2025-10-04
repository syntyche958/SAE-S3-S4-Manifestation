<script setup>
import { ref } from 'vue'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

// menu model
const items = ref([
  { label: 'accueil',command: () => { window.location.href = '/' }
  },
  {
    label: 'prestataire',
    items: [
      { label: 'page 1' },
      { label: 'page 2' },
    ],
  },
  {
    label: 'organisateur',
    items: [
      { label: 'page 1' },
      { label: 'page 2' },
    ],
  },
])
</script>

<template>
  <Menubar :model="items" class="NavbarMargin">
    <template #end>
      <Button label="Se connecter" class="p-button-outlined" />
    </template>
  </Menubar>
</template>

<style scoped>
.NavbarMargin{
  margin-bottom: 10px;
}
</style>
