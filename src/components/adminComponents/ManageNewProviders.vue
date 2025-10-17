<template>
  <div class="card">
    <h1 class="m-0">Demande de nouveau prestataires</h1>
    <DataTable :value="providerStore.newProviders" dataKey="id">
      <Column field="name" header="Nom" sortable style="min-width: 16rem" />
      <Column field="description" header="Description" sortable style="min-width: 20rem" />
      <Column style="min-width: 12rem" header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-check" variant="outlined" severity="success" @click="validate(slotProps.data)"
            title="Valider" v-tooltip.top="'Valider'" />
          <Button icon="pi pi-trash" variant="outlined" severity="danger" @click="_delete(slotProps.data)"
            title="Supprimer" v-tooltip.top="'Supprimer'" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useProviderStore } from '@/stores/providers';
import { Button, DataTable, Column } from 'primevue';

const providerStore = useProviderStore();
// TODO
const _delete = () => {

}
const validate = () => {

}
</script>
