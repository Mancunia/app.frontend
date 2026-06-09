import type { OriginType, OriginRequest } from '~/types/admin/origin'

export const getOrigins = () =>
  useRequest<OriginType[]>(
    { url: 'admin/origin/all', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const getOrigin = (id: string) =>
  useRequest<OriginType>(
    { url: `admin/origin/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createOrigin = (body: OriginRequest) =>
  useRequest<OriginType>(
    { url: 'admin/origin/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateOrigin = (id: string, body: Partial<OriginRequest>) =>
  useRequest<OriginType>(
    { url: `admin/origin/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )

export const toggleOrigin = (id: string) =>
  useRequest<OriginType>(
    { url: `admin/origin/${id}/toggle`, method: HTTP_METHODS.PATCH },
    USER_ROLES.ADMIN
  )
