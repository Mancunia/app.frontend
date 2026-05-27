import type { LanguageType } from '~/types/admin/language'

export const getLanguages = () =>
  useRequest<LanguageType[]>(
    { url: 'admin/language/all', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const addLanguage = (body: { title: string; active: boolean }) =>
  useRequest<LanguageType>(
    { url: 'admin/language/add', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )
