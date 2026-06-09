export type AuthorType = {
  id: string
  name: string
  bio?: string
  active: boolean
  createdAt?: string
}

export type AuthorRequest = {
  name: string
  bio?: string
  active?: boolean
}
