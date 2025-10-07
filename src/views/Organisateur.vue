<script setup>
import { ref } from 'vue';
import Button from "primevue/button";
import Menu from 'primevue/menu';

const menu = ref();
const activeSection = ref('manifestation')

const toggle =(event) => {
  menu.value.toggle(event)
};
const items = ref([
  {
    label: 'Gérer la manifestation',
    icon: 'pi pi-file-edit',
    command : () => activeSection.value = 'manifestaion'
  },
  {
    label: 'Carte Interactive',
    icon: 'pi pi-map',
    command : () => activeSection.value = 'carte'
  },
  {
    label : 'Gerer les prestataires',
    icon : 'pi pi-users',
    command : () => activeSection.value = 'prestataires'
  },
  {
    label: 'Espace Prestataire',
    icon: 'pi pi-home',
    command : () => activeSection.value = 'espace prestataire'
  },
  {
    label: 'Statistiques',
    icon: 'pi pi-chart-bar',
    command : () => activeSection.value = 'statistiques'
  }
]);
</script>

<template>
  <div class="organisateur-container">
    <header class="header">
      <h1>Espace Organisateur</h1>
      <div class="user-info">
        <span>Bienvenue, Organisateur</span>
      </div>
    </header>

    <div class="main-content">
      <nav class="sidebar">
        <ul class="menu">
          <li
            @click="activeSection = 'manifestation'"
            :class="{ active: activeSection === 'manifestation'}"
          >
            <i class="pi pi-pi-file-edit"></i>
            Gérer la Manifestation
          </li>

          <li
            @click="activeSection = 'Carte'"
            :class="{ active: activeSection === 'Carte'}"
          >
            <i class="pi pi-map"></i>
            Carte Interactive
          </li>

          <li
            @click="activeSection = 'prestataires'"
            :class="{ active: activeSection === 'prestataires'}"
          >
            <i class="pi pi-users"></i>
            Gérer les prestataires
          </li>

          <li
            @click="activeSection = 'Espace Prestataire'"
            :class="{ active: activeSection === 'Espace Prestataire'}"
          >
            <i class="pi pi-home"></i>
            Espace Prestataire
          </li>

          <li
            @click="activeSection = 'Statistiques'"
            :class="{ active: activeSection === 'Statistiques'}"
          >
            <i class="pi pi-chart-bar"></i>
            Statistiques
          </li>
        </ul>
      </nav>
      <main class="content">
        <div class="mobile-menu"><br>
          <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"  severity="info" label="Menu" variant="text" raised />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>

        <div class="section">
          <h2>Bienvenue dans votre espace organisateur</h2>
          <p>Utiliser le menu pour gerer votre manifestation</p>
        </div>
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

.section h2 {
  color: var(--text-color, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color, #3B82F6);
}

/* Mobile menu */
.mobile-menu {
  display: none;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .content {
    padding: 1rem;
  }

  .section {
    padding: 1rem;
  }
}
</style>
