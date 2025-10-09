<script setup>
import { ref } from 'vue'

const activeSection = ref('manifestation')

const items = ref([
  {
    label: 'Apparence de la page',
    command: () => (activeSection.value = 'apparence'),
  },
  {
    label: 'Choix des services',
    command: () => (activeSection.value = 'services'),
  },
  {
    label: 'Gérer les reservations',
    command: () => (activeSection.value = 'reservations'),
  },
  {
    label: 'Regarder les statistiques',
    command: () => (activeSection.value = 'statistiques'),
  },
])
</script>

<template>
  <nav class="sidebar">
    <ul class="menu">
      <li @click="activeSection = 'apparence'" :class="{ active: activeSection === 'apparence' }">
        Page de présentation
      </li>
      <li @click="activeSection = 'services'" :class="{ active: activeSection === 'services' }">
        Choisir les services
      </li>
      <li
        @click="activeSection = 'reservations'"
        :class="{ active: activeSection === 'reservations' }"
      >
        Gérer les reservations
      </li>
      <li
        @click="activeSection = 'statistiques'"
        :class="{ active: activeSection === 'statistiques' }"
      >
        Statistiques
      </li>
    </ul>
  </nav>
  <div :style="{width: '220px', height:'220px', 'flex-shrink':0}"></div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 175px; /* ajuster selon la hauteur de ta navbar */
  left: 0;
  width: 220px;
  background: var(--surface-card, white);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  z-index: 1000;
  border-radius: 0 0 10px 0;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 1.2rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid var(--surface-border, #dee2e6);
  transition: all 0.3s;
}

.menu li:hover {
  background-color: var(--surface-hover, #f8f9fa);
}

.menu li.active {
  background-color: var(--primary-color-lighter, #eff6ff);
  border-left: 4px solid var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}
</style>
