<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Editor from 'primevue/editor'

import TheMap from '@/components/TheMap.vue'
import { FilterMatchMode } from '@primevue/core/api'

const menu = ref(null)

const activeSection = ref('manifestation')

const items = ref([
  { label: 'Gérer la manifestation', icon: 'pi pi-file-edit', command: () => (activeSection.value = 'manifestation') },
  { label: 'Carte Interactive', icon: 'pi pi-map', command: () => (activeSection.value = 'carte') },
  { label: 'Gerer les prestataires', icon: 'pi pi-users', command: () => (activeSection.value = 'prestataires') },
  { label: 'Espace Prestataire', icon: 'pi pi-home', command: () => (activeSection.value = 'espace_prestataire') },
  { label: 'Statistiques', icon: 'pi pi-chart-bar', command: () => (activeSection.value = 'statistiques') },
])

// Manifestation editor state
const manifestContent = ref('<h3>Titre de la manifestation</h3><p>Description...</p>')

// CRUD prestataires - simplifié
const dt = ref(null)
const products = ref([])
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const productForm = ref({})
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false)

// Espace prestataire
const selectedProvider = ref(null)

// Charger des données de demo
onMounted(() => {
  products.value = [
    { id: '1', name: 'Prestataire A', description: 'Description du prestataire A' },
    { id: '2', name: 'Prestataire B', description: 'Description du prestataire B' },
    { id: '3', name: 'Prestataire C', description: 'Description du prestataire C' },
  ]
})

// Utilitaires
const createId = () => {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
  return id
}
const findIndexById = (id) => {
  if (!products.value) return -1
  return products.value.findIndex((p) => p.id === id)
}

// Actions CRUD
const openNew = () => {
  productForm.value = {}
  submitted.value = false
  productDialog.value = true
}
const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}
const saveProduct = () => {
  submitted.value = true

  if (productForm.value?.name?.trim()) {
    if (productForm.value.id) {
      // update
      const idx = findIndexById(productForm.value.id)
      if (idx !== -1) products.value[idx] = { ...productForm.value }
    } else {
      // create
      productForm.value.id = createId()
      products.value.push({ ...productForm.value })
    }

    productDialog.value = false
    productForm.value = {}
  }
}
const editProduct = (prod) => {
  productForm.value = { ...prod }
  productDialog.value = true
}
const confirmDeleteProduct = (prod) => {
  productForm.value = prod
  deleteProductDialog.value = true
}
const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== productForm.value.id)
  deleteProductDialog.value = false
  productForm.value = {}
}

// Fonction pour ouvrir l'espace prestataire
function openProviderSpace(p) {
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
          <Editor v-model="manifestContent" />
          <div style="margin-top:12px">
            <Button label="Sauvegarder" icon="pi pi-save" @click="() => {}" />
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

        <!-- Gerer les prestataires -->
        <section class="section" v-if="activeSection === 'prestataires'">
          <h2>Gerer les prestataires</h2>
          <div class="card">
            <Toolbar class="mb-6">
              <template #start>
                <Button label="Nouveau Prestataire" icon="pi pi-plus" class="mr-4" @click="openNew" />
                <Button label="Supprimer" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDeleteProduct" />
              </template>
            </Toolbar>

            <div class="flex items-center justify-between mb-2">
              <h4 class="m-0">Gestion des Prestataires</h4>
              <div class="flex items-center gap-2">
                <i class="pi pi-search" />
                <InputText v-model="filters.global.value" placeholder="Rechercher..." />
              </div>
            </div>

            <DataTable
              ref="dt"
              :value="products"
              dataKey="id"
              :filters="filters"
            >
              <Column field="id" header="ID" sortable style="min-width: 8rem" />
              <Column field="name" header="Nom" sortable style="min-width: 16rem" />
              <Column field="description" header="Description" sortable style="min-width: 20rem" />
              <Column style="min-width: 12rem" header="Actions">
                <template #body="slotProps">
                  <Button icon="pi pi-eye" variant="outlined" rounded class="mr-2" @click="openProviderSpace(slotProps.data)" title="Ouvrir l'espace" />
                  <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editProduct(slotProps.data)" title="Modifier" />
                  <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" title="Supprimer" />
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Dialog prestataire -->
          <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Détails du Prestataire" :modal="true">
            <div class="flex flex-col gap-6">
              <div>
                <label for="name" class="block font-bold mb-3">Nom</label>
                <InputText id="name" v-model.trim="productForm.name" required autofocus :class="{ 'p-invalid': submitted && !productForm.name }" />
                <small v-if="submitted && !productForm.name" class="text-red-500">Le nom est requis.</small>
              </div>
              <div>
                <label for="description" class="block font-bold mb-3">Description</label>
                <Textarea id="description" v-model="productForm.description" rows="3" cols="20" />
              </div>
            </div>

            <template #footer>
              <Button label="Annuler" icon="pi pi-times" text @click="hideDialog" />
              <Button label="Enregistrer" icon="pi pi-check" @click="saveProduct" />
            </template>
          </Dialog>

          <!-- Delete dialog -->
          <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirmer" :modal="true">
            <div class="flex items-center gap-4">
              <i class="pi pi-exclamation-triangle !text-3xl" />
              <span v-if="productForm">Êtes-vous sûr de vouloir supprimer <b>{{ productForm.name }}</b> ?</span>
            </div>
            <template #footer>
              <Button label="Non" icon="pi pi-times" text @click="deleteProductDialog = false" severity="secondary" variant="text" />
              <Button label="Oui" icon="pi pi-check" @click="deleteProduct" severity="danger" />
            </template>
          </Dialog>
        </section>

        <!-- Espace prestataire (édition spécifique) -->
        <section class="section" v-if="activeSection === 'espace_prestataire'">
          <h2>Espace Prestataire</h2>
          <div v-if="!selectedProvider">Aucun prestataire sélectionné. Sélectionnez-en un depuis la liste des prestataires.</div>
          <div v-else>
            <h3>{{ selectedProvider.name }}</h3>
            <p>{{ selectedProvider.description }}</p>
            <p>Editeur WYSIWYG du prestataire :</p>
            <Editor v-model="selectedProvider.description" />
            <div style="margin-top:12px">
              <Button label="Sauvegarder les modifications" icon="pi pi-save" @click="() => {}" />
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
  </div>
</template>

<style scoped>

</style>
