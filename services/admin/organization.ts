import type { OrganizationType, OrganizationRequest } from '~/types/admin/organization'

export const getOrgs = () =>
  useRequest<OrganizationType[]>(
    { url: 'admin/organization/', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const getOrg = (id: string) =>
  useRequest<OrganizationType>(
    { url: `admin/organization/${id}`, method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createOrg = (body: OrganizationRequest) =>
  useRequest<OrganizationType>(
    { url: 'admin/organization/create', method: HTTP_METHODS.POST, data: body },
    USER_ROLES.ADMIN
  )

export const updateOrg = (id: string, body: Partial<OrganizationRequest>) =>
  useRequest<OrganizationType>(
    { url: `admin/organization/${id}`, method: HTTP_METHODS.PUT, data: body },
    USER_ROLES.ADMIN
  )
