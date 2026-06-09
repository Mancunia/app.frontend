export type NarratorType = {
  id: string
  name: string
  bio?: string
  active: boolean
  createdAt?: string
}

export type NarratorRequest = {
  name: string
  bio?: string
  active?: boolean
}
