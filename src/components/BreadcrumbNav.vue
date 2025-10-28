<template>
  <Breadcrumb :home="home" :model="activity" />
</template>

<script setup>
import Breadcrumb from 'primevue/breadcrumb'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useProviderStore } from '@/stores/providers'

// TODO : Utiliser seulement pour la page activité !

const route = useRoute()

const providerStore = useProviderStore()

const home = ref()
const activity = ref([])

function updateBreadcrumb() {
  home.value = {
    label: providerStore.providers.find((p) => p.id == route.params.provider_id).name,
  }
}

watch(() => route.path, updateBreadcrumb, { immediate: true })
</script>
