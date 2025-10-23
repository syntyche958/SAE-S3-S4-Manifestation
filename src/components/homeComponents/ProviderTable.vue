<template>
  <Card :style="{ 'flex-grow': 1 }">
    <template #content>
      <DataTable v-model:filters="filters" :value="providers" paginator :rows="10" dataKey="id" filterDisplay="menu"
        :loading="loading" :globalFilterFields="['name']">

        <!-- Header -->
        <template #header>
          <div :style="{ 'display': 'flex', 'justify-content': 'space-between' }">
            <Button type="button" icon="pi pi-filter-slash" :label="$t('message.clear')" variant="outlined"
              @click="clearFilter()" />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" :placeholder="$t('message.keywordSearch')" />
            </IconField>
          </div>
        </template>

        <template #empty>No providers found.</template>
        <template #loading>Loading data. Please wait...</template>

        <!-- Column name -->
        <Column field="name" header="Name" sortable style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by name" />
          </template>
        </Column>

        <!-- Column « go to page »  -->
        <Column field="id" header="" style="min-width: 12rem">
          <template #body="{ data }">
            <Button type="button" :label="$t('message.goToPage')" @click="goToPage(data.id)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { InputText, Button, DataTable, Column, IconField, InputIcon, Card } from 'primevue';
import { useProviderStore } from '@/stores/providers';
import router from '@/router/index.js'

const providerStore = useProviderStore();
const providers = computed(() => providerStore.providers)
const filters = ref({});
const loading = ref(true);

watch(providers, () => {
  if (providers.value != null) {
    console.log('in')
    loading.value = false
  }
}, { immediate: true, deep: true })

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  }
}

initFilters()

const clearFilter = () => {
  initFilters();
};

// TODO : Go to specific providers page
// TODO : Go to specific providers page
const goToPage = (providerId) => {
  console.log("TODO : go to provider " + providerId + " page");
  router.push({ name: 'provider_page', params: { provider_id: providerId } })
}
</script>
