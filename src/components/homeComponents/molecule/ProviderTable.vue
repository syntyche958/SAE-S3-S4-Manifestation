<template>
  <Card class="grow sm:my-4 sm:mr-4 h-fit">
    <template #content>
      <DataTable
        v-model:filters="filters"
        :value="activity"
        rowGroupMode="rowspan"
        groupRowsBy="provider.name"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['name', 'provider.name']"
        sortMode="single"
        sortField="provider.name"
      >
        <!-- Header -->
        <template #header>
          <div :style="{ display: 'flex', 'justify-content': 'space-between' }">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              :label="$t('message.clear')"
              variant="outlined"
              @click="clearFilter()"
              size="small"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                :placeholder="$t('message.keywordSearch')"
              />
            </IconField>
          </div>
        </template>

        <template #empty>{{ $t('message.noActivityFound') }}</template>
        <template #loading>{{ $t('message.loadingPlsWait') }}</template>

        <!-- Column provider -->
        <Column field="provider.name" :header="$t('message.provider')" style="min-width: 12rem">
          <template #body="{ data }">
            <span>{{ data.provider.name }}</span
            ><Button
              icon="pi pi-info-circle"
              label=""
              size="small"
              rounded
              variant="link"
              @click="$router.push(`/provider/${data.providerId}`)"
            />
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by name" />
          </template>
        </Column>

        <!-- Column activity -->
        <Column field="name" :header="$t('message.activity')" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span>{{ data.name }}</span
            ><Button
              icon="pi pi-info-circle"
              label=""
              size="small"
              rounded
              variant="link"
              @click="$router.push(`/provider/${data.providerId}/activity/${data.id}`)"
            />
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by name" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { InputText, Button, DataTable, Column, IconField, InputIcon, Card } from 'primevue'
import { useProviderStore } from '@/stores/providers'
import { useActivityStore } from '@/stores/activities'

const providerStore = useProviderStore()
const activityStore = useActivityStore()

const activity = computed(() =>
  activityStore.activities.map((a) => {
    return { ...a, provider: providerStore.get(a.providerId) }
  }),
)
const filters = ref({})
const loading = ref(true)

watch(
  activity,
  () => {
    if (activity.value != null) {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    'provider.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}
</script>
