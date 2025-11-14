  <script setup>
  import { ref, watchEffect } from 'vue'
  import { useRoute } from 'vue-router'
  import providerActivities from '@/components/providerComponents/ProviderActivities.vue'
  import providerDescription from '@/components/providerComponents/ProviderDescription.vue'
  import providerGalleria from '@/components/providerComponents/ProviderGalleria.vue'

  </script>

  <template>
    <div>
      <div class="content">
        <providerGalleria />

        <providerDescription />
      </div>


      <providerActivities />
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

  /* Nouveau style du menu prestataire : collé à la navbar, en haut à gauche */
  .section h2 {
    color: var(--text-color, #212529);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-color, #3b82f6);
  }
  </style>
