import type { NarratorType } from '~/types/admin/narrator'

export const getNarrators = (params?: { page?: number; limit?: number; search?: string }) =>
  useRequest<{ data: NarratorType[]; total: number; page: number; limit: number }>(
    { url: '/narrator/', method: HTTP_METHODS.GET, params },
    USER_ROLES.USER
  )

export const getNarrator = (id: string) =>
  useRequest<NarratorType>(
    { url: `/narrator/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.USER
  )
