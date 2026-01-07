<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div>
          <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
            {{ item.beginingDate }} {{ item.beginingHour }}
          </span>
          <div class="text-lg font-medium mt-2">Session #{{ item.id }}</div>
          <div class="text-sm text-surface-600 mt-1">
            Durée: {{ item.duration }} minutes
          </div>
          <div class="text-sm text-surface-600 mt-1">
            Places: {{ item.nbPlace - item.registersUsers.length }} / {{ item.nbPlace }}
          </div>
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-8">
        <div v-if="canRegister" class="flex flex-row-reverse md:flex-row gap-2">
          <Button 
            v-if="isCurrentProviderOwner"
            icon="pi pi-users"
            label="Voir les inscrits"
            severity="info"
            outlined
            @click="$emit('show-registrants', item)"
            class="flex-auto md:flex-initial whitespace-nowrap"
          />
          <Button
            :icon="isRegistered ? 'pi pi-check' : 'pi pi-user-plus'"
            :label="isRegistered ? 'Déjà inscrit' : $t('message.signUp')"
            @click="$emit('inscription', item)"
            :disabled="item.nbPlace <= item.registersUsers.length || isRegistered || !isUserConnected"
            :severity="isRegistered ? 'success' : 'primary'"
            class="flex-auto md:flex-initial whitespace-nowrap"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

const props = defineProps({
  item: Object,
  isCurrentProviderOwner: Boolean,
  isRegistered: Boolean,
  isUserConnected: Boolean,
  canRegister: Boolean
})

defineEmits(['inscription', 'show-registrants'])
</script>
