<script setup>
import Breadcrumb from 'primevue/breadcrumb';
const breadItem={
  Accueil:{
    label:'Accueil'
  }
}
</script>
<template>
  <Breadcrumb :home="breadItem" :model="breadItem"/>
</template>
