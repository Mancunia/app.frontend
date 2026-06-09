import type { AuthorType } from '~/types/admin/author'

export const getAuthors = (params?: { page?: number; limit?: number; search?: string }) =>
  useRequest<{ data: AuthorType[]; total: number; page: number; limit: number }>(
    { url: '/author/', method: HTTP_METHODS.GET, params },
    USER_ROLES.USER
  )

export const getAuthor = (id: string) =>
  useRequest<AuthorType>(
    { url: `/author/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.USER
  )
