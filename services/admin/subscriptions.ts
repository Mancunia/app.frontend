import type {
  CreatePlanPayload,
  SubscriberListParams,
  SubscriberListResponse,
  SubscriptionPlan,
  SubscriptionStats,
  UpdatePlanPayload,
} from '~/types/admin/subscriptions'

export const getSubscriptionStats = () =>
  useRequest<SubscriptionStats>(
    { url: 'admin/subscriptions/stats', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

/** All plans (including inactive / hidden) — admin view */
export const getAdminPlans = () =>
  useRequest<SubscriptionPlan[]>(
    { url: 'admin/subscription/all', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  )

export const createPlan = (data: CreatePlanPayload) =>
  useRequest<SubscriptionPlan>(
    { url: 'admin/subscription/create', method: HTTP_METHODS.POST, data },
    USER_ROLES.ADMIN
  )

export const updatePlan = (id: string, data: UpdatePlanPayload) =>
  useRequest<SubscriptionPlan>(
    { url: `admin/subscription/${id}`, method: HTTP_METHODS.PUT, data },
    USER_ROLES.ADMIN
  )

export const deletePlan = (id: string) =>
  useRequest<{ message: string }>(
    { url: `admin/subscription/${id}`, method: HTTP_METHODS.DELETE },
    USER_ROLES.ADMIN
  )

/** Paginated subscriber list with optional search / plan / status filters */
export const getSubscriberList = (data: SubscriberListParams) =>
  useRequest<SubscriberListResponse>(
    { url: 'admin/subscriptions/list', method: HTTP_METHODS.POST, data },
    USER_ROLES.ADMIN
  )
