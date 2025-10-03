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
    label: 'Options',
    items: [
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
    ]}
]);
</script>

<template>
  <div class="organisateur-container">
    <header class="header">
      <h1>Espace Organisateur</h1>
      <div class="user-info">
        <span>Bienvenue, Organisateur</span>
        <Button icon="pi pi-sign-out" label="Déconnexion" severity="danger" text />
      </div>
    </header>

    <div class="main-content">
        <div class="card flex justify-center">
          <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"  severity="info" label="Menu" variant="text" raised />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
