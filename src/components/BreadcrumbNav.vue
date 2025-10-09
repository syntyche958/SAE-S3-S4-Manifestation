<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { computed } from 'vue'

const home = {
  label: 'Accueil',
  command: () => { window.location.href = '/' }
}

const AllItems = [
  { label: 'Prestataires',here: false },
  { label: 'activité',here: false }
]//trouver comment afficher ces items quand on arrive à la bonne page trouver route actuel et se baser dessus?

const items = computed(()=>AllItems.filter(item=>item.here))

</script>
<template>
  <Breadcrumb :home="home" :model="items"/>
</template>
