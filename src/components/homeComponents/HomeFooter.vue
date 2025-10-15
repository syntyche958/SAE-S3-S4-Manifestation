<template>
  <div id="footer">
    <!-- Button -->
    <Button :label="$t('message.registerAsProvider')" icon="pi pi-user-plus" @click="openModal()" severity="secondary"
      style="min-width: 10rem" />

    <!-- Modal -->
    <Dialog v-model:visible="visible" :header="$t('message.registerAsProvider')" :style="{ width: '25rem' }"
      position="bottom" :modal="true" :draggable="false">
      <div class="input-text-container">
        <label for="provider-name">{{ $t('message.providerName') }}</label>
        <InputText id="provider-name" autocomplete="off" v-model="newProviderName" />
      </div>
      <div id="button-container">
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

const openModal = () => {
  visible.value = true;
}

const registerProvider = () => {
  visible.value = false;
  const providerStore = useProviderStore()
  providerStore.addNewProvider(newProviderName.value)
  console.log(providerStore.newProviders)
}

</script>

<style scoped>
#footer {
  background-color: aquamarine;
  width: 100%;
  height: 30vh;
}

label {
  width: calc(0.25rem*24);
  font-weight: 600;
}

#provider-name {
  flex: auto;
}

#button-container {
  display: flex;
  justify-content: flex-end;
  gap: calc(0.25rem*2);
}

.input-text-container {
  display: flex;
  align-items: center;
  margin-bottom: calc(0.25rem * 4);
  gap: calc(0.25rem * 4);
}
</style>
