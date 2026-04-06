<template>
    <Button
    :label="$t('message.contactProvider')"
    icon="pi pi-envelope"
    @click="openModal()"
    severity="secondary"
    style="min-width: 10rem"
    size="small"
  />

    <Dialog
    v-model:visible="visible"
    :header="$t('message.contactProvider')"
    class="w-auto sm:w-[25vw]"
    :modal="true"
    :draggable="false"
  >
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full"
    >
            <div class="flex flex-col gap-1">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" name="email" type="text" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>

            <div class="flex flex-col gap-1">
        <label class="font-semibold w-24">{{ $t('message.provider') }}</label>
        <Select
          :options="providerStore.providers"
          optionLabel="name"
          name="provider"
          :placeholder="$t('message.selectProviderPlaceholder')"
          fluid
          @update:modelValue="onProviderChange"
        />
        <Message v-if="$form.provider?.invalid" severity="error" size="small" variant="simple">{{
          $form.provider.error?.message
        }}</Message>
      </div>

            <div class="flex flex-col gap-1">
        <label class="font-semibold w-24">{{ $t('message.activity') }}</label>
        <Select
          :key="selectedProviderId ?? 'no-provider'"
          name="activity"
          :options="activitySelectOptions"
          optionLabel="label"
          :placeholder="$t('message.selectActivityPlaceholder')"
          :emptyMessage="$t('message.noActivityFound')"
          :filter="true"
          :filterPlaceholder="$t('message.search')"
          fluid
        />
        <Message v-if="$form.activity?.invalid" severity="error" size="small" variant="simple">{{
          $form.activity.error?.message
        }}</Message>
      </div>

            <div class="flex flex-col gap-1">
        <label for="message" class="font-semibold w-24">Message</label>
        <Textarea id="message" name="message" fluid />
        <Message v-if="$form.message?.invalid" severity="error" size="small" variant="simple">{{
          $form.message.error?.message
        }}</Message>
      </div>

            <div class="flex justify-end gap-2">
        <Button
          type="button"
          :label="$t('message.cancel')"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="submit" :label="$t('message.send')"></Button>
      </div> </Form
  ></Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Button, InputText, Dialog, Select, Textarea, Message } from 'primevue'
import { Form } from '@primevue/forms'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useProviderStore } from '@/stores/providers'
import { useActivityStore } from '@/stores/activities'
import { useContactStore } from '@/stores/contact'
import { z } from 'zod'

const { t } = useI18n()
const providerStore = useProviderStore()
const activityStore = useActivityStore()
const contactStore = useContactStore()

const visible = ref(false)
const initialValues = ref({
  email: '',
  provider: null,
  activity: null,
  message: '',
})
const selectedProvider = ref(null)

const selectedProviderId = computed(() => {
  const id = selectedProvider.value?.id
  return id == null ? null : Number(id)
})

const activitySelectOptions = computed(() => {
  if (selectedProviderId.value == null) return []
  return (activityStore.activities || [])
    .filter((a) => Number(a.providerId) === selectedProviderId.value)
    .map((a) => ({ id: a.id, label: a.name }))
    .sort((x, y) => x.label.localeCompare(y.label, 'fr', { sensitivity: 'base' }))
})

function onProviderChange(provider) {
  selectedProvider.value = provider
}

function contactActivityId(activityField) {
  if (activityField == null) return null
  if (typeof activityField === 'object' && activityField.id != null) return activityField.id
  return activityField
}

const openModal = async () => {
  await Promise.all([activityStore.getAllActivities(), providerStore.getAllProviders()])
  selectedProvider.value = null
  visible.value = true
}

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return

  visible.value = false
  contactStore.addContact(
    values.email,
    values.provider.id,
    contactActivityId(values.activity),
    values.message,
  )
}

const resolver = ref(
  zodResolver(
    z.object({
      email: z
        .email({ message: 'Invalid email address.' })
        .min(1, { message: 'Email is required.' }),
      message: z
        .string()
        .min(10, { message: 'Message with more than ten characters is required.' }),
      provider: z
        .any()
        .refine((p) => p !== undefined && p !== null, {
          message: 'Provider selection is required',
        }),
      activity: z.any().refine((a) => contactActivityId(a) != null, {
        message: t('message.activityRequired'),
      }),
    }),
  ),
)
</script>
