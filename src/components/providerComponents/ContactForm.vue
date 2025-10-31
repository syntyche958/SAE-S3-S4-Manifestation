<template>
  <!-- Button -->
  <Button
    :label="$t('message.contactProvider')"
    icon="pi pi-envelope"
    @click="openModal()"
    severity="secondary"
    style="min-width: 10rem"
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
          fluid
        />
        <Message v-if="$form.provider?.invalid" severity="error" size="small" variant="simple">{{
          $form.provider.error?.message
        }}</Message>
      </div>

      <!-- TODO : Default value if on a activity page ! -->
      <!-- TODO : Ajouter quand le store activity sera mis en place -->
      <!-- Activity input -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold w-24">{{ $t('message.activity') }} (opt)</label>
        <Select
          disabled
          :options="activities"
          optionLabel="name"
          placeholder="Select the activity"
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
import { ref } from 'vue'
import { Button, InputText, Dialog, Select, Textarea, Message } from 'primevue'
import { Form } from '@primevue/forms'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useProviderStore } from '@/stores/providers'
import { useContactStore } from '@/stores/contact'
import { z } from 'zod'

const providerStore = useProviderStore()
const contactStore = useContactStore()

const visible = ref(false)
const initialValues = ref({
  email: '',
  activity: '',
  message: '',
})
const activities = ref([]) // TODO

const openModal = () => {
  visible.value = true
}

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return

  visible.value = false
  contactStore.addContact(values.email, values.provider.id, null, values.message)
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
        .refine((p) => p !== undefined, { message: 'Provider selection is required' }),
    }),
  ),
)
</script>
