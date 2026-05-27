import type { RevenueSummary } from '~/types/admin/revenue'

export const getRevenueSummary = () =>
  useRequest<RevenueSummary>(
    { url: 'admin/revenue/summary', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )
