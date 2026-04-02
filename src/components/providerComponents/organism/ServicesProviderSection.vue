<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityStore } from '@/stores/activities'
import registrationService from '@/services/registration.service'
import { displaySuccessToast } from '@/utils/toast.utils'
import { useI18n } from 'vue-i18n'
import { enqueueNotificationsForUsers } from '@/utils/visitorNotifications.utils'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

const { t } = useI18n()
const route = useRoute()
const activityStore = useActivityStore()

const providerId = computed(() => Number.parseInt(route.params.provider_id))

const visibilityOptions = computed(() => [
  { label: t('message.publicLabel'), value: 'public' },
  { label: t('message.providerOnly'), value: 'provider_only' },
])

const activities = computed(() =>
  activityStore.activities.filter((a) => Number(a.providerId) === providerId.value),
)

async function onToggle(activity, field, value) {
  await activityStore.updateServiceFlags(activity.id, { [field]: value })
}

async function onVisibilityChange(activity, value) {
  await activityStore.updateServiceFlags(activity.id, { visibility: value })
}

async function onSessionRegistrationToggle(activity, value) {
  const registrationsResponse = await registrationService.getRegistrationsByActivity(activity.id)
  const registrations = registrationsResponse.error === 0 ? registrationsResponse.data : []
  const registrationCount = registrations.length

  if (!value && registrationCount > 0) {
    const confirmed = window.confirm(
      t('message.confirmDisableSession'),
    )

    if (!confirmed) {
      return
    }
  }

  await activityStore.updateServiceFlags(activity.id, {
    sessionsEnabled: value,
    canRegister: value,
  })

  if (!value && registrationCount > 0) {
    const registeredUserIds = registrations
      .map((r) => r.user_id ?? r.userId)
      .filter((id) => id !== undefined && id !== null)

    enqueueNotificationsForUsers(
      registeredUserIds,
      `Le prestataire a désactivé les inscriptions pour l'activité "${activity.name}".`,
    )

    displaySuccessToast(
      t('message.sessionDisabledWarning'),
    )
  }
}
</script>

<template>
  <Card>
    <template #title>{{ $t('message.serviceManagement') }}</template>

    <template #content>
      <DataTable :value="activities" tableStyle="min-width: 72rem">
        <Column field="name" :header="$t('message.service')" />

        <Column :header="$t('message.active')">
          <template #body="slotProps">
            <Checkbox :modelValue="slotProps.data.serviceEnabled" :binary="true"
              @update:modelValue="(v) => onToggle(slotProps.data, 'serviceEnabled', v)" />
          </template>
        </Column>

        <Column :header="$t('message.visibility')">
          <template #body="slotProps">
            <Select :modelValue="slotProps.data.visibility" :options="visibilityOptions" optionLabel="label"
              optionValue="value" class="w-full" @update:modelValue="(v) => onVisibilityChange(slotProps.data, v)" />
          </template>
        </Column>

        <Column :header="$t('message.commentsLabel')">
          <template #body="slotProps">
            <Checkbox :modelValue="slotProps.data.commentsEnabled" :binary="true"
              @update:modelValue="(v) => onToggle(slotProps.data, 'commentsEnabled', v)" />
          </template>
        </Column>

        <Column :header="$t('message.sessionRegistration')">
          <template #body="slotProps">
            <Checkbox :modelValue="slotProps.data.sessionsEnabled && slotProps.data.canRegister" :binary="true"
              @update:modelValue="(v) => onSessionRegistrationToggle(slotProps.data, v)" />
          </template>
        </Column>

        <Column :header="$t('message.statsCount')">
          <template #body="slotProps">
            <Checkbox :modelValue="slotProps.data.registrationCountEnabled" :binary="true"
              @update:modelValue="(v) => onToggle(slotProps.data, 'registrationCountEnabled', v)" />
          </template>
        </Column>

        <Column :header="$t('message.state')">
          <template #body="slotProps">
            <Tag :severity="slotProps.data.serviceEnabled ? 'success' : 'danger'"
              :value="slotProps.data.serviceEnabled ? $t('message.active') : $t('message.inactive')" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  white-space: nowrap;
}

:deep(.p-tag) {
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}

:deep(.p-tag-success) {
  background-color: #10b981;
  color: white;
}

:deep(.p-tag-danger) {
  background-color: #ef4444;
  color: white;
}
</style>
