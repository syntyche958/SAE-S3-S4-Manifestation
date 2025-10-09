<script setup>
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { computed } from 'vue'

const props = defineProps({
  userType: Object
})

const allItems = {
  accueil: {
    label: 'Accueil',
    command: () => { window.location.href = '/' },
  },
  prestataire: {
    label: 'Prestataire',
    command: () => { window.location.href = '/provider' },
    items: [
      { label: 'Page 1' },
      { label: 'Page 2' },
    ],
  },
  organisateur: {
    label: 'Organisateur',
    command: () => { window.location.href = '/organizer' },
    items: [
      { label: 'Page 1' },
      { label: 'Page 2' },
    ],
  },
}

const items = computed(() => {
  console.log(props.userType)
  switch (props.userType) {
    case "admin":
      return [allItems.accueil, allItems.prestataire, allItems.organisateur];
    case "provider":
      return [allItems.accueil, allItems.prestataire];
    default:
      return [allItems.accueil];
  }
})
</script>

<template>
  <Menubar :model="items" class="NavbarMargin">
    <template #end>
      <Button label="Se connecter" class="p-button-outlined" />
    </template>
  </Menubar>
  <div class="NavbarBottom"></div>
</template>

<style scoped>
.NavbarMargin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  color: #EFEFEF;
}

.NavbarBottom {
  height: 80px;
}
</style>
