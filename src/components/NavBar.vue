<script setup>
import { ref, computed } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { useRoute } from 'vue-router'
const routeActuel = useRoute()


const userRole = ref('organisateur') // test role ( organisateur  / prestataire / visiteur ) le les met ici pour le ctrl c (ou rien pour voir les deux)


const allItems = {
  accueil: {
    label: 'Accueil',
    command: () => { window.location.href = '/' },
  },
  prestataire: {
    label: 'Prestataire',
    command: () => { window.location.href = '/provider' },
  },
  organisateur: {
    label: 'Organisateur',
    command: () => { window.location.href = '/organisateur' },
  },
}


const items = computed(() => { //computed meilleur solution? ou alors mettre dans variable des boulean?
  if (userRole.value === 'prestataire') {
    return [allItems.accueil, allItems.prestataire]
  } else if (userRole.value === 'organisateur') {
    return [allItems.accueil,allItems.prestataire, allItems.organisateur]
  }
  else if (userRole.value === 'visiteur') {
    return [allItems.accueil]}
  else {
    return [allItems.accueil, allItems.prestataire, allItems.organisateur]
  }
})
console.log(routeActuel.path)
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
.NavbarBottom{
  height: 80px;
}

</style>
