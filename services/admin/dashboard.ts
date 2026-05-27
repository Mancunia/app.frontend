import type { DashboardStats, PulsePoint } from '~/types/admin/dashboard'

export const getDashboardStats = () =>
  useRequest<DashboardStats>(
    { url: 'admin/dashboard/stats', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const getDashboardPulse = (days = 14) =>
  useRequest<PulsePoint[]>(
    { url: 'admin/dashboard/pulse', method: HTTP_METHODS.GET, params: { days } },
    USER_ROLES.ADMIN
  )
