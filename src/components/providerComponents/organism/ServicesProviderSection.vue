<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityStore } from '@/stores/activities'
import registrationService from '@/services/registration.service'
import sessionsService from '@/services/sessions.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import { useI18n } from 'vue-i18n'
import { enqueueNotificationsForUsers } from '@/utils/visitorNotifications.utils'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const { t } = useI18n()
const route = useRoute()
const activityStore = useActivityStore()
const confirm = useConfirm()
const sessionToggleVersion = ref(0)

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

async function getRegistrationsByActivity(activityId) {
  const sessionsResponse = await sessionsService.getSessionsByActivityId(activityId)
  if (sessionsResponse.error !== 0) {
    return []
  }

  const sessions = Array.isArray(sessionsResponse.data) ? sessionsResponse.data : []
  const registrationsBySession = await Promise.all(
    sessions.map(async (session) => {
      const response = await registrationService.getRegistrationsBySession(session.id)
      if (response.error !== 0) return []
      return (response.data || []).map((registration) => ({
        sessionId: session.id,
        userId: registration.user_id ?? registration.userId,
      }))
    }),
  )

  return registrationsBySession
    .flat()
    .filter((registration) => registration.userId !== undefined && registration.userId !== null)
}

async function deleteRegistrations(registrations) {
  const deletions = await Promise.allSettled(
    registrations.map((registration) =>
      registrationService.deleteRegistration(registration.sessionId, registration.userId),
    ),
  )

  return deletions.every(
    (result) => result.status === 'fulfilled' && result.value?.error === 0,
  )
}

function confirmDisableSessionModal(registrationCount) {
  return new Promise((resolve) => {
    confirm.require({
      group: 'services-provider-confirm',
      message: t('message.confirmDisableSession', { count: registrationCount }),
      header: t('message.deleteConfirmHeader'),
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: t('message.no'),
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: t('message.yes'),
        severity: 'danger',
      },
      accept: () => resolve(true),
      reject: () => resolve(false),
      onHide: () => resolve(false),
    })
  })
}

function resetSessionToggleVisual() {
  sessionToggleVersion.value += 1
}

async function onSessionRegistrationToggle(activity, value) {
  const registrations = await getRegistrationsByActivity(activity.id)
  const registrationCount = registrations.length

  if (!value && registrationCount > 0) {
    const confirmed = await confirmDisableSessionModal(registrationCount)

    if (!confirmed) {
      resetSessionToggleVisual()
      return
    }

    const deletionOk = await deleteRegistrations(registrations)
    if (!deletionOk) {
      displayErrToast(t('message.registrationDeleteFailed'))
      resetSessionToggleVisual()
      return
    }
  }

  await activityStore.updateServiceFlags(activity.id, {
    sessionsEnabled: value,
    canRegister: value,
  })

  if (!value && registrationCount > 0) {
    const registeredUserIds = registrations.map((r) => r.userId)

    enqueueNotificationsForUsers(
      registeredUserIds,
      `Le prestataire a désactivé les inscriptions pour l'activité "${activity.name}".`,
    )

    displaySuccessToast(
      t('message.sessionDisabledWarning', { count: registrationCount }),
    )
  }
}
</script>

<template>
  <ConfirmDialog group="services-provider-confirm" />
  <Card>
    <template #title>{{ $t('message.serviceManagement') }}</template>

    <template #content>
      <DataTable :value="activities" tableStyle="min-width: 72rem">
        <Column field="name" :header="$t('message.service')" />

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
            <Checkbox :key="`session-${slotProps.data.id}-${sessionToggleVersion}`"
              :modelValue="slotProps.data.sessionsEnabled && slotProps.data.canRegister" :binary="true"
              @update:modelValue="(v) => onSessionRegistrationToggle(slotProps.data, v)" />
          </template>
        </Column>

        <Column :header="$t('message.statsCount')">
          <template #body="slotProps">
            <Checkbox :modelValue="slotProps.data.registrationCountEnabled" :binary="true"
              @update:modelValue="(v) => onToggle(slotProps.data, 'registrationCountEnabled', v)" />
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
</style>
