<script setup>
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LocaleChanger from '@/components/LocaleChanger.vue';

const authStore = useAuthStore();

const allItems = {
  accueil: {
    label: 'Accueil',
    command: () => { window.location.href = '/' },
  },
  prestataire: {
    label: 'Prestataire',
    command: () => { window.location.href = '/provider' },
    items: [
      { label: 'Page 1' },
      { label: 'Page 2' },
    ],
  },
  organisateur: {
    label: 'Administrateur',
    command: () => { window.location.href = '/admin' },
  },
}

const items = computed(() => {
  let type = authStore.user?.type
  switch (type) {
    case "admin":
      return [allItems.accueil, allItems.prestataire, allItems.organisateur];
    case "provider":
      return [allItems.accueil, allItems.prestataire];
    default:
      return [allItems.accueil];
  }
})
</script>

<template>
  <Menubar :model="items" class="NavbarMargin">
    <template #end>
      <div style="display: flex;">
        <LocaleChanger />
        <Button label="Se connecter" class="p-button-outlined" />
      </div>
    </template>
  </Menubar>
  <div class="NavbarBottom"></div>
</template>

<style scoped>
.NavbarMargin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  color: #EFEFEF;
}

.NavbarBottom {
  height: 80px;
}
</style>
