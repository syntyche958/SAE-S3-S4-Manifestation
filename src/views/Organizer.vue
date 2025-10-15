<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Editor from 'primevue/editor'

import TheMap from "@/components/TheMap.vue";
import { MapMode } from '@/enums/Map.enums';

const menu = ref(null)
const activeSection = ref('manifestation')

// eslint-disable-next-line no-unused-vars
const toggle = (event) => menu.value && menu.value.toggle(event)

// eslint-disable-next-line no-unused-vars
const items = ref([
  { label: 'Gérer la manifestation', icon: 'pi pi-file-edit', command: () => (activeSection.value = 'manifestation') },
  { label: 'Carte Interactive', icon: 'pi pi-map', command: () => (activeSection.value = 'carte') },
  { label: 'Gerer les prestataires', icon: 'pi pi-users', command: () => (activeSection.value = 'prestataires') },
  { label: 'Espace Prestataire', icon: 'pi pi-home', command: () => (activeSection.value = 'espace_prestataire') },
  { label: 'Statistiques', icon: 'pi pi-chart-bar', command: () => (activeSection.value = 'statistiques') },
])

// Manifestation editor state
const manifestContent = ref('<h3>Titre de la manifestation</h3><p>Description...</p>')
</script>

<template>
  <div class="organisateur-container">
    <header class="header">
      <h1>Espace Organisateur</h1>
      <div class="user-info">
        <span>Bienvenue,Organisateur</span>
      </div>
    </header>

    <div class="main-content">
      <nav class="sidebar">
        <ul class="menu">
          <li :class="{ active: activeSection === 'manifestation' }" @click="(activeSection = 'manifestation')">
            <i class="pi pi-file-edit"></i>
            Gérer la Manifestation
          </li>

          <li :class="{ active: activeSection === 'carte' }" @click="(activeSection = 'carte')">
            <i class="pi pi-map"></i>
            Carte Interactive
          </li>

          <li :class="{ active: activeSection === 'prestataires' }" @click="(activeSection = 'prestataires')">
            <i class="pi pi-users"></i>
            Gérer les prestataires
          </li>

          <li :class="{ active: activeSection === 'espace_prestataire' }"
            @click="(activeSection = 'espace_prestataire')">
            <i class="pi pi-home"></i>
            Espace Prestataire
          </li>

          <li :class="{ active: activeSection === 'statistiques' }" @click="(activeSection = 'statistiques')">
            <i class="pi pi-chart-bar"></i>
            Statistiques
          </li>
        </ul>
      </nav>

      <main class="content">
        <!-- Pour gerer les manifestations-->
        <section class="section" v-if="activeSection === 'manifestation'">
          <h2>Modifier la présentation de la manifestation</h2>
          <p>Editeur WYSIWYG :</p>
          <Editor v-model:html.sync="manifestContent" />
          <div style="margin-top:12px">
            <Button label="Sauvegarder" icon="pi pi-save" @click="() => { }" />
          </div>
          <div class="preview" style="margin-top:16px">
            <h3>Aperçu</h3>
            <div v-html="manifestContent" />
          </div>
        </section>

        <!-- Carte interactive -->
        <section class="section" v-if="activeSection === 'carte'">
          <h2>Carte interactive</h2>
          <TheMap :displayMode="MapMode.ADMIN" />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.organisateur-container {
  min-height: 100vh;
  background-color: var(--surface-ground, #f8f9fa);
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
}

/* Header */
.header {
  background: var(--primary-color, #3B82F6);
  color: var(--primary-color-text, white);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Layout principal */
.main-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--surface-card, white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.menu li:hover {
  background-color: var(--surface-hover, #f8f9fa);
}

.menu li.active {
  background-color: var(--primary-color-lighter, #EFF6FF);
  border-left: 4px solid var(--primary-color, #3B82F6);
  color: var(--primary-color, #3B82F6);
}

.menu li i {
  font-size: 1.2rem;
}

/* Contenu principal */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section {
  background: var(--surface-card, white);
  border-radius: var(--border-radius, 6px);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.section h2 {
  color: var(--text-color, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color, #3B82F6);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column
  }

  .sidebar {
    display: none
  }
}
</style>
