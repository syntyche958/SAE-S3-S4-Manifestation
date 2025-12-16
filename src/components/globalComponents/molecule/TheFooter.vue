<template>
  <!-- <Divider type="solid" /> -->
  <div class="w-full bg-transparent flex justify-center gap-2 h-[6vh] items-center">
    <ContactForm />
    <NewProviderForm />
    <SatisfactionForm v-if="authStore.user?.type !== UserTypeEnum.ADMIN" />
    <Button 
      v-else
      :label="$t('Reception des avis')"
      icon="pi pi-comments"
      @click="openMessagingDialog"
      severity="secondary"
      style="min-width: 10rem"
      size="small"
    />
  </div>

  <!--Dialog de messagerie pour l'admin-->
  <Dialog
    v-model:visible="messagingDialogVisible"
    :header="$t('Formulaire de satisfaction')"
    :style="{ width: '90vw', maxWidth: '1200px', height: '85vh' }"
    :modal="true"
    :draggable="false"
  >
    <AdminMessaging/>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import NewProviderForm from '@/components/homeComponents/molecule/NewProviderForm.vue'
import ContactForm from '@/components/activityComponents/molecule/ContactForm.vue'
import SatisfactionForm from '@/components/homeComponents/molecule/SatisfactionForm.vue'
import AdminMessaging from '@/components/adminComponents/molecule/AdminMessaging.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'

const authStore = useAuthStore()
const messagingDialogVisible = ref(false)

function openMessagingDialog() {
  messagingDialogVisible.value = true
}
</script>
