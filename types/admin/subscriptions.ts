export type SubscriptionPlan = {
  id: string
  name: string
  active: boolean
  visible: boolean
  amount: number
  duration: number   // milliseconds
  users: number
  autorenew: boolean
  origin: string
  accent: string
  createdAt: string
  books?: string[]
}

/** Subscriber record as returned by GET /admin/subscriptions/stats → data.recent[] */
export type AdminSubscriberRecord = {
  id: string
  user: { username: string; email: string; dp: string }
  plan: string
  autorenew: boolean
  activatedAt: string | null
  expiresAt: string | null      // activatedAt + plan duration; null = never activated
  daysRemaining: number | null  // signed; negative = expired; null = never activated
}

export type SubscriptionStats = {
  active: number
  byPlan: { name: string; count: number; amount: number }[]
  recent: AdminSubscriberRecord[]
}

export type SubscriberRecord = {
  id: string
  user: { id?: string; username: string; email: string; dp?: string }
  plan: string        // plan name
  activatedAt: string | null
  active: boolean
  amount?: number
  autorenew?: boolean
  expiresAt?: string | null
  daysRemaining?: number | null
}

export type SubscriberListResponse = {
  results: SubscriberRecord[]
  total: number
  page: number
  pages: number
}

export type SubscriberListParams = {
  search?: string
  planId?: string
  status?: 'active' | 'free'
  page?: number
  limit?: number
}

export type CreatePlanPayload = {
  name: string
  amount: number
  duration: number   // milliseconds
  origin: string
  users?: number
  autorenew?: boolean
  active?: boolean
  visible?: boolean
  accent?: string
  books?: string[]
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>
