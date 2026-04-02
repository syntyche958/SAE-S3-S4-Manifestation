<template>
  <ConfirmDialog></ConfirmDialog>
  <Card>
    <template #content>
      <h2 class="m-0">{{ $t('message.newProviders') }}</h2>
      <DataTable :value="providerStore.newProviders" dataKey="id">
        <template #empty>{{ $t('message.noNewRequest') }}</template>

        <Column field="name" :header="$t('message.name')" sortable style="min-width: 16rem" />
        <Column field="description" :header="$t('message.description')" sortable style="min-width: 20rem" />
        <Column style="min-width: 12rem" :header="$t('message.actions')">
          <template #body="slotProps">
            <Button
              icon="pi pi-check"
              variant="outlined"
              severity="success"
              @click="confirmValidation(slotProps.data)"
              v-tooltip.top="$t('message.validate')"
            />
            <Button
              icon="pi pi-trash"
              variant="outlined"
              severity="danger"
              @click="confirmDeletion(slotProps.data)"
              :title="$t('message.delete')"
              v-tooltip.top="$t('message.delete')"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { useProviderStore } from '@/stores/providers'
import { Button, DataTable, Column, Card } from 'primevue'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm()

const providerStore = useProviderStore()

const confirmDeletion = (data) => {
  confirm.require({
    message: t('message.deleteConfirmMessage', { name: data?.name ?? '' }),
    header: t('message.deleteConfirmHeader'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('message.cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('message.delete'),
      severity: 'danger',
    },
    accept: async () => {
      await providerStore.removeNewProvider(data)
    },
  })
}

const confirmValidation = (data) => {
  confirm.require({
    message: t('message.validateConfirmMessage', { name: data?.name ?? '' }),
    header: t('message.validateConfirmHeader'),
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: t('message.cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('message.validate'),
      severity: 'success',
    },
    accept: async () => {
      await providerStore.validateNewProviders(data)
    },
  })
}
</script>
