<script setup>
import { ref, computed } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'


const userRole = ref('') // test role ( organisateur  / prestataire) le les met ici pour le ctrl c (ou rien pour voir les deux)


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
      { label: 'Page 2'},
    ],
  },
}


const items = computed(() => { //computed meilleur solution? ou alors mettre dans variable des boulean?
  if (userRole.value === 'prestataire') {
    return [allItems.accueil, allItems.prestataire]
  } else if (userRole.value === 'organisateur') {
    return [allItems.accueil, allItems.organisateur]
  } else {
    return [allItems.accueil, allItems.prestataire, allItems.organisateur]
  }
})
</script>

<template>
  <Menubar :model="items" class="NavbarMargin">
    <template #end>
      <Button label="Se connecter" class="p-button-outlined" />
    </template>
  </Menubar>
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
</style>
