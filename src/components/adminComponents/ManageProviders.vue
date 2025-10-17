<template>
  <div class="card">
    <h1 class="m-0">Demande de nouveau prestataires</h1>
    <!-- TODO : Remplacer pendingProviders par les données du store ! -->
    <DataTable :value="pendingProviders" dataKey="id">
      <Column field="name" header="Nom" sortable style="min-width: 16rem" />
      <Column field="description" header="Description" sortable style="min-width: 20rem" />
      <Column style="min-width: 12rem" header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-check" variant="outlined" rounded severity="danger" @click="validate(slotProps.data)"
            title="Valider" />
          <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="_delete(slotProps.data)"
            title="Supprimer" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { Button, DataTable, Column } from 'primevue';
// TODO
const _delete = () => {

}
const validate = () => {

}
</script>
