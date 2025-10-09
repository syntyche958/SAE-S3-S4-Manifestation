<script setup>
import { ref, reactive, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Editor from 'primevue/editor'

//import DataTable from 'primevue/datatable';
//import Column from 'primevue/column';
//import ColumnGroup from 'primevue/columngroup';   // optional
//import Row from 'primevue/row';                   // optional

import { useProviderStore } from '@/stores/providers'
import TheMap from "@/components/TheMap.vue";

const menu = ref(null)
const activeSection = ref('manifestation')

const toggle = (event) => menu.value && menu.value.toggle(event)

const items = ref([
  { label: 'Gérer la manifestation', icon: 'pi pi-file-edit', command: () => (activeSection.value = 'manifestation') },
  { label: 'Carte Interactive', icon: 'pi pi-map', command: () => (activeSection.value = 'carte') },
  { label: 'Gerer les prestataires', icon: 'pi pi-users', command: () => (activeSection.value = 'prestataires') },
  { label: 'Espace Prestataire', icon: 'pi pi-home', command: () => (activeSection.value = 'espace_prestataire') },
  { label: 'Statistiques', icon: 'pi pi-chart-bar', command: () => (activeSection.value = 'statistiques') },
])

// Manifestation editor state
const manifestContent = ref('<h3>Titre de la manifestation</h3><p>Description...</p>')

// Providers CRUD
const providerStore = useProviderStore()
const providers = ref([])
const loadingProviders = ref(true)

const selectedProvider = ref(null)
const providerDialog = ref(false)
const isEdit = ref(false)
const form = reactive({ id: null, name: '', description: '' })

onMounted(async () => {
  await providerStore.getAllProviders()
  providers.value = providerStore.providers
  loadingProviders.value = false
})

function openNewProvider() {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.description = ''
  providerDialog.value = true
}

function editProvider(p) {
  isEdit.value = true
  form.id = p.id
  form.name = p.name
  form.description = p.description || ''
  providerDialog.value = true
}

function saveProvider() {
  if (!form.name) return
  if (isEdit.value) {
    // update in local store (no backend): find and replace
    const idx = providers.value.findIndex((x) => x.id === form.id)
    if (idx !== -1) {
      providers.value[idx] = { ...providers.value[idx], name: form.name, description: form.description }
    }
  } else {
    // create local id
    const newId = Date.now()
    providers.value.push({ id: newId, name: form.name, description: form.description })
  }
  providerDialog.value = false
}

function deleteProvider(p) {
  providers.value = providers.value.filter((x) => x.id !== p.id)
}

function openProviderSpace(p) {
  // switch section and mark selected
  selectedProvider.value = p
  activeSection.value = 'espace_prestataire'
}
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

          <li :class="{ active: activeSection === 'espace_prestataire' }" @click="(activeSection = 'espace_prestataire')">
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
        <!-- Manifestation editor -->
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
          <TheMap />
        </section>

        <!--espace Prestataire-->












        <!-- Prestataires CRUD -->
        <section class="section" v-if="activeSection === 'prestataires'">
          <h2>Gérer les prestataires</h2>
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
            <Button label="Nouveau prestataire" icon="pi pi-plus" @click="openNewProvider" />
            <InputText placeholder="Rechercher..." />
          </div>

          <div v-if="loadingProviders">Chargement...</div>

          <table v-else class="p-datatable p-component" style="width:100%">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in providers" :key="p.id">
                <td>{{ p.id }}</td>
                <td>{{ p.name }}</td>
                <td>{{ p.description }}</td>
                <td>
                  <Button icon="pi pi-eye" class="p-button-text" @click="openProviderSpace(p)" title="Ouvrir l'espace" />
                  <Button icon="pi pi-pencil" class="p-button-text" @click="editProvider(p)" title="Edit" />
                  <Button icon="pi pi-trash" class="p-button-text" @click="deleteProvider(p)" title="Supprimer" />
                </td>
              </tr>
            </tbody>
          </table>
        </section>






        <!-- Espace prestataire (édition spécifique) -->
        <section class="section" v-if="activeSection === 'espace_prestataire'">
          <h2>Espace Prestataire</h2>
          <div v-if="!selectedProvider">Aucun prestataire sélectionné. Sélectionnez-en un depuis la liste des prestataires.</div>
          <div v-else>
            <h3>{{ selectedProvider.name }}</h3>
            <p>{{ selectedProvider.description }}</p>
            <p>Editeur WYSIWYG du prestataire :</p>
            <Editor v-model:html.sync="selectedProvider.description" />
            <div style="margin-top:12px">
              <Button label="Sauvegarder les modifications" icon="pi pi-save" @click="() => { /* persist provider changes if backend exists */ }" />
              <Button label="Retour" class="p-button-text" @click="activeSection = 'prestataires'" />
            </div>
          </div>
        </section>

        <!-- Statistiques (placeholder graphique) -->
        <section class="section" v-if="activeSection === 'statistiques'">
          <h2>Statistiques</h2>
          <p>Graphiques et visualisations basés sur les données publiées par les prestataires.</p>
          <div style="height:300px;display:flex;align-items:center;justify-content:center;background:#fff;border:1px dashed #ddd">
            Placeholder pour graphiques (ex: chart.js, apexcharts)
          </div>
        </section>
      </main>
    </div>

    <Dialog v-model:visible="providerDialog" header="Prestataire" :modal="true" :style="{ width: '450px' }">
      <div class="p-fluid">
        <label>Nom</label>
        <InputText v-model="form.name" />
        <label style="margin-top:8px">Description</label>
        <Editor v-model:html.sync="form.description" />
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="providerDialog = false" />
        <Button label="Enregistrer" icon="pi pi-check" @click="saveProvider" />
      </template>
    </Dialog>
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

/* Responsive */
@media (max-width: 768px) {
  .main-content { flex-direction: column }
  .sidebar { display: none }
}

</style>
