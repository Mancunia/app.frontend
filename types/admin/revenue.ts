export type RevenueSummary = {
  mrr: number
  totalActiveSubscribers: number
  byPlan: { name: string; amount: number; count: number; contribution: number }[]
}
