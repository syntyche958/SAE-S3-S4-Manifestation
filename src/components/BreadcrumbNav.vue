<script setup>
import Breadcrumb from 'primevue/breadcrumb';

const home = {
  label: 'Accueil',
  command: () => { console.log('test') }
}


const items = [/*
  { label: 'Prestataires' },
  { label: 'activité' }*/
]

</script>
<template>
  <Breadcrumb :home="home" :model="items"/>
</template>
