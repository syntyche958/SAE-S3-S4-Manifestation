<template>
  <div class="card"></div>
  <DataTable v-model:filters="filters" :value="providers" paginator :rows="2" dataKey="id" filterDisplay="menu"
    :loading="loading" :globalFilterFields="['name']">

    <!-- Header -->
    <template #header>
      <div class="flex justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" @click="clearFilter()" />
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Search..." />
        </span>
      </div>
    </template>

    <template #empty>No providers found.</template>
    <template #loading>Loading data. Please wait...</template>

    <!-- Column name -->
    <Column field="name" header="Name" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.name }}
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" placeholder="Search by name" />
      </template>
    </Column>
  </DataTable>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { InputText, Button, DataTable, Column } from 'primevue';

var data = [{ id: 1, name: '(AAC) Associtaion des Archers de Carcassonne' }, { id: 2, name: 'Troupe de troubadours' }]

const providers = ref();
const filters = ref();
const loading = ref(true);

onMounted(() => {
  // TODO : Call apiService to get this data !
  providers.value = data;
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

</script>
