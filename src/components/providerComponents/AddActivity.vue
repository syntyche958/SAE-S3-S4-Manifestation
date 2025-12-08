<template>
  <div v-if="!isProviderAdminPanelToHide()">
    <Button
      icon="pi pi-plus"
      rounded
      severity="contrast"
      size="small"
      variant="outlined"
      @click="visible = true"
    />
    <Dialog
      v-model:visible="visible"
      modal
      :header="$t('message.addActivity')"
      :style="{ width: '25rem' }"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-24">{{ $t('message.name') }}</label>
        <InputText id="name" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="desc" class="font-semibold w-24">Description</label>
        <InputText id="desc" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          :label="$t('message.cancel')"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="button" :label="$t('message.save')" @click="visible = false"></Button>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Button, Dialog, InputText } from 'primevue'
import { isProviderAdminPanelToHide } from '@/utils/user.utils'

const visible = ref(false)
</script>
