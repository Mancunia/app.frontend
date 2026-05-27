export type OrganizationType = {
  id: string
  name: string
  description?: string
  type: string
  logo?: string
}

export type OrganizationRequest = Omit<OrganizationType, 'id'>
