<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="card">
    <h1 class="m-0">Demande de nouveau prestataires</h1>
    <DataTable :value="providerStore.newProviders" dataKey="id">
      <Column field="name" header="Nom" sortable style="min-width: 16rem" />
      <Column field="description" header="Description" sortable style="min-width: 20rem" />
      <Column style="min-width: 12rem" header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-check" variant="outlined" severity="success" @click="confirmValidation(slotProps.data)"
            title="Valider" v-tooltip.top="'Valider'" />
          <Button icon="pi pi-trash" variant="outlined" severity="danger" @click="confirmDeletion(slotProps.data)"
            title="Supprimer" v-tooltip.top="'Supprimer'" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useProviderStore } from '@/stores/providers';
import { Button, DataTable, Column } from 'primevue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

const providerStore = useProviderStore();

const confirmDeletion = (data) => {
  confirm.require({
    message: `Êtes vous sûr de vouloir supprimer la demande de ${data.name}`,
    header: 'Suppression',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Annuler',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Supprimer',
      severity: 'danger'
    },
    accept: async () => {
      await providerStore.removeNewProvider(data)
    }
  });
};

const confirmValidation = (data) => {
  confirm.require({
    message: `Êtes vous sûr de vouloir valider la demande de ${data.name}`,
    header: "Ajout d'un prestataire",
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Annuler',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Valider',
      severity: 'success'
    },
    accept: async () => {
      await providerStore.validateNewProviders(data)
    }
  });
}
</script>
