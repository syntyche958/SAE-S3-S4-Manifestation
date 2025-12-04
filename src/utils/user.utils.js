import { UserTypeEnum } from '@/enums/User.enum'
import { useAuthStore } from '@/stores/auth'
import { useProviderStore } from '@/stores/providers'
import { useRoute } from 'vue-router'

export function isProviderAdminPanelToHide() {
  const route = useRoute()
  const authStore = useAuthStore()
  const providerStore = useProviderStore()

  // Visitor
  if (authStore.user?.type === UserTypeEnum.VISITOR) return true

  // Not the corresponding provider
  const pageProviderId = Number(route.params.provider_id)
  const connectedUserProviderId = providerStore.providers.find(
    (p) => p.userId === authStore.user.id,
  )?.id
  if (authStore.user?.type === UserTypeEnum.PROVIDER && pageProviderId !== connectedUserProviderId)
    return true

  return false
}
