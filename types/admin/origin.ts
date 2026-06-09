export type OriginType = {
  id: string
  name: string
  flag: string
  currency?: { name?: string; symbol?: string }
  active: boolean
  createdAt?: string
}

export type OriginRequest = {
  name: string
  flag: string
  currency?: { name?: string; symbol?: string }
  active?: boolean
}
