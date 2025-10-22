<template>
  <div id="footer">
    <!-- Button -->
    <Button :label="$t('message.registerAsProvider')" icon="pi pi-user-plus" @click="openModal()" severity="secondary"
      style="min-width: 10rem" />

    <!-- Modal -->
    <Dialog v-model:visible="visible" :header="$t('message.registerAsProvider')" :style="{ width: '25rem' }"
      :modal="true" :draggable="false">
      <div class="flex items-center gap-4 mb-4">
        <label for="provider-name" class="font-semibold w-24">{{ $t('message.providerName') }}</label>
        <InputText id="provider-name" class="flex-auto" autocomplete="off" v-model="newProviderName" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="provider-description" class="font-semibold w-24">Description</label>
        <InputText id="provider-description" class="flex-auto" autocomplete="off" v-model="providerDescription" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" :label="$t('message.cancel')" severity="secondary" @click="visible = false"></Button>
        <Button type="button" :label="$t('message.send')" @click="registerProvider()"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Dialog, Button, InputText } from 'primevue';
import { useProviderStore } from '@/stores/providers';

const visible = ref(false);
const newProviderName = ref("")
const providerDescription = ref("")

const openModal = () => {
  visible.value = true;
}

const registerProvider = () => {
  visible.value = false;
  const providerStore = useProviderStore()
  providerStore.addNewProvider(newProviderName.value, providerDescription.value)
  newProviderName.value = ""
}

</script>

<style scoped>
#footer {
  background-color: aquamarine;
  width: 100%;
  height: 30vh;
}
</style>
