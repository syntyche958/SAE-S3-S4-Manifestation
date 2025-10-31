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
    :style="{ width: '30rem' }"
    :modal="true"
    :draggable="false"
  >
    <!-- TODO : Vérifier que le mail est bien formulé, regex ? -->
    <div class="flex items-center gap-4 mb-4">
      <label for="visitor-mail" class="font-semibold w-24">Email</label>
      <InputText id="visitor-mail" class="flex-auto" autocomplete="off" v-model="visitorMail" />
    </div>

    <div class="flex items-center gap-4 mb-8">
      <label class="font-semibold w-24">{{ $t('message.provider') }}</label>
      <!-- TODO : Default value if on a provider page ! -->
      <Select
        v-model="selectedProvider"
        :options="providers"
        optionLabel="name"
        placeholder="Select the provider"
        class="w-full md:w-56"
      />
    </div>

    <!-- TODO : Default value if on a activity page ! -->
    <!-- TODO : Ajouter quand le store activity sera mis en place -->
    <div class="flex items-center gap-4 mb-8">
      <label class="font-semibold w-24">{{ $t('message.activity') }} (opt)</label>
      <Select
        disabled
        v-model="selectedActivity"
        :options="activities"
        optionLabel="name"
        placeholder="Select the activity"
        class="w-full md:w-56"
      />
    </div>

    <div class="flex items-center gap-4 mb-8">
      <label for="message" class="font-semibold w-24">Message</label>
      <Textarea id="message" rows="5" cols="31" v-model="message" />
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        :label="$t('message.cancel')"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button
        type="button"
        :label="$t('message.send')"
        v-tooltip.top="{
          value: $t('message.fillAllFields'),
          disabled: !btnDisabled,
          class: 'text-center',
        }"
        @click="sendRequest()"
        :disabled="btnDisabled"
      ></Button>
    </div>
  </Dialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Button, InputText, Dialog, Select, Textarea } from 'primevue'
import { useProviderStore } from '@/stores/providers'
import { useContactStore } from '@/stores/contact'

const providerStore = useProviderStore()
const contactStore = useContactStore()

const visible = ref(false)
const btnDisabled = computed(() =>
  message.value != '' && visitorMail.value != '' && selectedProvider.value ? false : true,
)
const message = ref('')
const providers = computed(() => providerStore.providers)
const visitorMail = ref('')
const selectedProvider = ref()
// const activities = computed(() => activityStore.getFrom(providers.value.id))
// const selectedActivity = ref()

const openModal = () => {
  visible.value = true
}

function sendRequest() {
  visible.value = false
  // Reset values
  message.value = ''
  visitorMail.value = ''

  contactStore.addContact(visitorMail.value, selectedProvider.value.id, null, message.value)
}
</script>
