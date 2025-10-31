<template>
  <!-- Button -->
  <Button
    :label="$t('message.registerAsProvider')"
    icon="pi pi-user-plus"
    @click="openModal()"
    severity="secondary"
    style="min-width: 10rem"
    size="small"
  />

  <!-- Modal -->
  <Dialog
    v-model:visible="visible"
    :header="$t('message.registerAsProvider')"
    :style="{ width: '30rem' }"
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
      <!-- New provider name input -->
      <div class="flex flex-col gap-1">
        <label for="name" class="font-semibold w-24">{{ $t('message.providerName') }}</label>
        <InputText id="name" class="flex-auto" name="name" fluid />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
          $form.name.error?.message
        }}</Message>
      </div>

      <!-- Description input -->
      <div class="flex flex-col gap-1">
        <label for="description" class="font-semibold w-24">Description</label>
        <Textarea id="description" name="description" fluid />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
          $form.description.error?.message
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
        <Button type="submit" :label="$t('message.send')"></Button></div
    ></Form>
  </Dialog>
</template>

<script setup>
import { z } from 'zod'
import { ref } from 'vue'
import { Dialog, Button, InputText, Textarea, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'

import { useProviderStore } from '@/stores/providers'

const providerStore = useProviderStore()

const visible = ref(false)
const initialValues = ref({
  name: '',
  description: '',
})

const openModal = () => {
  visible.value = true
}

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return

  visible.value = false
  providerStore.addNewProvider(values.name, values.description)
}

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(3, { message: 'Name with more than 2 characters is required.' }),
      description: z
        .string()
        .min(10, { message: 'Description with more than 10 characters is required.' }),
    }),
  ),
)
</script>
