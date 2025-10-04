<template>
  <Card :style="{ 'flex-grow': 1 }">
    <template #content>
      <DataTable v-model:filters="filters" :value="providers" paginator :rows="10" dataKey="id" filterDisplay="menu"
        :loading="loading" :globalFilterFields="['name']">

        <!-- Header -->
        <template #header>
          <div :style="{ 'display': 'flex', 'justify-content': 'space-between' }">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
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
            <Button type="button" label="Go to page" @click="goToPage(data.id)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { InputText, Button, DataTable, Column, IconField, InputIcon, Card } from 'primevue';
import { useProviderStore } from '@/stores/providers';

const providers = ref([]);
const filters = ref({});
const loading = ref(true);

onMounted(async () => {
  const providerStore = useProviderStore();
  await providerStore.getAllProviders();
  providers.value = providerStore.providers;
  loading.value = false;
})

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
const goToPage = (providerId) => {
  console.log("TODO : go to provider " + providerId + " page");
}
</script>
