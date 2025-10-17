<template>
  <nav class="sidebar">
    <ul class="menu">
      <menu v-for= "manifestation"
      <li
        :class="{ active: activeSection === 'manifestation' }"
        @click="activeSection = 'manifestation'"
      >
        <i class="pi pi-file-edit"></i>
        Gérer la Manifestation
      </li>

      <li :class="{ active: activeSection === 'carte' }" @click="activeSection = 'carte'">
        <i class="pi pi-map"></i>
        Carte Interactive
      </li>

      <li
        :class="{ active: activeSection === 'prestataires' }"
        @click="activeSection = 'prestataires'"
      >
        <i class="pi pi-users"></i>
        Gérer les prestataires
      </li>

      <li
        :class="{ active: activeSection === 'espace_prestataire' }"
        @click="activeSection = 'espace_prestataire'"
      >
        <i class="pi pi-home"></i>
        Espace Prestataire
      </li>

      <li
        :class="{ active: activeSection === 'statistiques' }"
        @click="activeSection = 'statistiques'"
      >
        <i class="pi pi-chart-bar"></i>
        Statistiques
      </li>
    </ul>
  </nav>
</template>
<script setup>
var menuData = [{name: 'manifestation', onclick: () => activeSection = 'manifestation', iconClass:"pi-file-edit", text: "Gérer la manifestation"}]
</script>
