<template>
  <div v-if="!isProviderAdminPanelToHide()">
    <!-- Button -->
    <Button
      icon="pi pi-plus"
      rounded
      severity="contrast"
      size="small"
      variant="outlined"
      @click="visible = true"
    />
    <!-- Modal -->
    <Dialog
      v-model:visible="visible"
      modal
      :header="$t('message.addActivity')"
      :style="{ width: '25rem' }"
    >
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <!-- Name input -->
        <div class="flex flex-col gap-1">
          <label for="name" class="font-semibold w-24">{{ $t('message.name') }}</label>
          <InputText id="name" name="name" />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}</Message>
        </div>
        <!-- Desc input -->
        <div class="flex flex-col gap-1 mb-8">
          <label for="desc" class="font-semibold w-24">Description</label>
          <InputText id="desc" name="desc" class="flex-auto" />
          <Message v-if="$form.desc?.invalid" severity="error" size="small" variant="simple">{{
            $form.desc.error?.message
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
          <Button type="submit" :label="$t('message.save')"></Button></div
      ></Form>
    </Dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Button, Dialog, InputText, Message } from 'primevue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const visible = ref(false)
const initialValues = ref({
  name: '',
  desc: '',
  message: '',
})
const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      desc: z.string().min(1, { message: 'Description is required' }),
    }),
  ),
)

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return

  visible.value = false
  console.log('TODO : ', values)
  // contactStore.addContact(values.email, values.provider.id, null, values.message)
}
</script>
