<template>
  <!-- Button -->
  <Button
    :label="$t('message.contactProvider')"
    icon="pi pi-envelope"
    @click="openModal()"
    severity="secondary"
    style="min-width: 10rem"
    size="small"
  />

  <!-- Modal -->
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
      <!-- Email input -->
      <div class="flex flex-col gap-1">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" name="email" type="text" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>

      <!-- Provider input -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold w-24">{{ $t('message.provider') }}</label>
        <!-- TODO : Default value if on a provider page ! -->
        <Select
          :options="providerStore.providers"
          optionLabel="name"
          name="provider"
          placeholder="Select the provider"
          @update:modelValue="onProviderChange"
          fluid
        />
        <Message v-if="$form.provider?.invalid" severity="error" size="small" variant="simple">{{
          $form.provider.error?.message
        }}</Message>
      </div>

      <!-- Activity input -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold w-24">{{ $t('message.activity') }} (opt)</label>
        <Select
          :key="selectedProviderId ?? 'no-provider'"
          name="activity"
          :options="filteredActivities"
          optionLabel="name"
          placeholder="Select the activity"
          emptyMessage="No activity available"
          fluid
        />
      </div>

      <!-- Message input -->
      <div class="flex flex-col gap-1">
        <label for="message" class="font-semibold w-24">Message</label>
        <Textarea id="message" name="message" fluid />
        <Message v-if="$form.message?.invalid" severity="error" size="small" variant="simple">{{
          $form.message.error?.message
        }}</Message>
      </div>

      <!-- Buttons -->
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
import { computed, ref } from 'vue'
import { Button, InputText, Dialog, Select, Textarea, Message } from 'primevue'
import { Form } from '@primevue/forms'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useProviderStore } from '@/stores/providers'
import { useActivityStore } from '@/stores/activities'
import { useContactStore } from '@/stores/contact'
import { z } from 'zod'

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

const filteredActivities = computed(() => {
  if (selectedProviderId.value == null) return []
  return activityStore.activities.filter((a) => Number(a.providerId) === selectedProviderId.value)
})

const onProviderChange = (provider) => {
  selectedProvider.value = provider
}

const openModal = async () => {
  if (!activityStore.activities.length) {
    await activityStore.getAllActivities()
  }
  selectedProvider.value = null
  visible.value = true
}

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return

  visible.value = false
  contactStore.addContact(values.email, values.provider.id, values.activity?.id ?? null, values.message)
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
    }),
  ),
)
</script>
