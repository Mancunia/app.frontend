import type { GenreType } from '~/types/admin/genre'

export const getGenres = (params?: { search?: string; page?: number; limit?: number }) =>
  useRequest<{ data: GenreType[]; total: number; page: number; limit: number }>(
    { url: 'admin/genre/all', method: HTTP_METHODS.GET, params },
    USER_ROLES.ADMIN
  )

export const getGenre = (id: string) =>
  useRequest<GenreType>(
    { url: `admin/genre/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createGenre = (body: { title: string }) =>
  useRequest<GenreType>(
    { url: 'admin/genre/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateGenre = (id: string, body: { title: string }) =>
  useRequest<GenreType>(
    { url: `admin/genre/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )

export const toggleGenreActive = (id: string) =>
  useRequest<GenreType>(
    { url: `admin/genre/${id}/toggle`, method: HTTP_METHODS.PATCH },
    USER_ROLES.ADMIN
  )

export const deleteGenre = (id: string) =>
  useRequest<void>(
    { url: `admin/genre/${id}`, method: HTTP_METHODS.DELETE },
    USER_ROLES.ADMIN
  )
