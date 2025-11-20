<script setup>
import ProviderActivities from '@/components/providerComponents/ProviderActivities.vue'
import ProviderDescription from '@/components/providerComponents/ProviderDescription.vue'
import ProviderGalleria from '@/components/providerComponents/ProviderGalleria.vue'
</script>

<template>
  <div>
    <div class="content">
      <ProviderGalleria />
      <ProviderDescription />
    </div>
    <ProviderActivities />
  </div>
</template>

<style scoped>
.content {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  margin-bottom: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* TODO : Tout les h2 doivent être du même style ? */
/* Nouveau style du menu prestataire : collé à la navbar, en haut à gauche */
.section h2 {
  color: var(--text-color, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color, #3b82f6);
}
</style>
