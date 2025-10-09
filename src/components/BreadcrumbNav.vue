<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const home = {
  label: 'Accueil',
  command: () => router.push('/')
}


const items = ref([])

function updateBreadcrumb() {
  const segments = route.path.split('/').filter(Boolean)//découpe  route en item et sup élément vide (filter)
  items.value = segments.map((segment, index) => {//crée item
    const path = '/' + segments.slice(0, index + 1).join('/')//recrée chemin
    return {
      label:  segment.slice(0),
      command: () => router.push(path)
    }
  })
}


watch(() => route.path, updateBreadcrumb, { immediate: true })
</script>
<template>
  <Breadcrumb :home="home" :model="items"/>
</template>
