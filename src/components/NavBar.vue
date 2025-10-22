<script setup>
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LocaleChanger from '@/components/LocaleChanger.vue';
import router from '@/router';
import { UserTypeEnum } from '@/enums/User.enum';

const authStore = useAuthStore();

const allItems = {
  accueil: {
    label: 'Accueil',
    command: () => { router.push('/') },
  },
  prestataire: {
    label: 'Prestataire',
    command: () => { router.push('/provider') },
  },
  organisateur: {
    label: 'Administrateur',
    command: () => { router.push('/admin') },
  },
}

const items = computed(() => {
  switch (authStore.user?.type) {
    case UserTypeEnum.ADMIN:
      return [allItems.accueil, allItems.prestataire, allItems.organisateur];
    case UserTypeEnum.PROVIDER:
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
