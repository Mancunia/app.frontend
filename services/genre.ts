import type { GenreType } from '~/types/admin/genre'

export const getConsumerGenres = () =>
  useRequest<GenreType[]>(
    { url: '/book/genre/', method: HTTP_METHODS.GET },
    USER_ROLES.USER
  )
