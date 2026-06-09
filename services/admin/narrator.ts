import type { NarratorType, NarratorRequest } from '~/types/admin/narrator'

export const getNarrators = (params?: { search?: string; page?: number; limit?: number }) =>
  useRequest<{ data: NarratorType[]; total: number; page: number; limit: number }>(
    { url: 'admin/narrator/all', method: HTTP_METHODS.GET, params },
    USER_ROLES.ADMIN
  )

export const getNarrator = (id: string) =>
  useRequest<NarratorType>(
    { url: `admin/narrator/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createNarrator = (body: NarratorRequest) =>
  useRequest<NarratorType>(
    { url: 'admin/narrator/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateNarrator = (id: string, body: Partial<NarratorRequest>) =>
  useRequest<NarratorType>(
    { url: `admin/narrator/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )

export const deleteNarrator = (id: string) =>
  useRequest<void>(
    { url: `admin/narrator/${id}`, method: HTTP_METHODS.DELETE },
    USER_ROLES.ADMIN
  )
