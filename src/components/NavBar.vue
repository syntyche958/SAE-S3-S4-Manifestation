<script setup>
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LocaleChanger from '@/components/LocaleChanger.vue'
import router from '@/router'
import { UserTypeEnum } from '@/enums/User.enum'
import { useProviderStore } from '@/stores/providers'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()
const providerStore = useProviderStore()

const homeItem = {
  label: computed(() => t('message.home')),
  command: () => {
    router.push('/')
  },
}
const adminItem = {
  label: computed(() => t('message.admin')),
  command: () => {
    router.push('/admin')
  },
}

const items = computed(() => {
  let providersItem = {
    label: t('message.providers'),
    items: [],
  }

  for (let provider of providerStore.providers) {
    providersItem.items.push({
      label: provider.name,
      command: () => {
        router.push(`/provider/${provider.id}`)
      },
    })
  }

  switch (authStore.user?.type) {
    case UserTypeEnum.ADMIN:
      return [homeItem, providersItem, adminItem]
    default:
      return [homeItem, providersItem]
  }
})
</script>

<template>
  <Menubar :model="items" class="NavbarMargin">
    <template #end>
      <div style="display: flex">
        <LocaleChanger />
        <Button label="Se connecter" class="p-button-outlined" />
      </div>
    </template>
  </Menubar>
  <div class="NavbarBottom"></div>
</template>

<style scoped>
.NavbarMargin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  color: #efefef;
}

.NavbarBottom {
  height: 80px;
}
</style>
