import type { AuthorType, AuthorRequest } from '~/types/admin/author'

export const getAuthors = (params?: { search?: string; page?: number; limit?: number }) =>
  useRequest<{ data: AuthorType[]; total: number; page: number; limit: number }>(
    { url: 'admin/author/all', method: HTTP_METHODS.GET, params },
    USER_ROLES.ADMIN
  )

export const getAuthor = (id: string) =>
  useRequest<AuthorType>(
    { url: `admin/author/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createAuthor = (body: AuthorRequest) =>
  useRequest<AuthorType>(
    { url: 'admin/author/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateAuthor = (id: string, body: Partial<AuthorRequest>) =>
  useRequest<AuthorType>(
    { url: `admin/author/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )

export const deleteAuthor = (id: string) =>
  useRequest<void>(
    { url: `admin/author/${id}`, method: HTTP_METHODS.DELETE },
    USER_ROLES.ADMIN
  )
