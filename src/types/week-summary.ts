export type UserCompletionsSummary = Record<
  string,
  {
    id: string
    goalName: string
    completedAt: string
  }[]
>

export type GroupCompletionsSummary = Record<
  string,
  {
    id: string
    user: string
    goalName: string
    completedAt: string
  }[]
>

export interface WeekSummary {
  total: number
  completed: number
  goalsPerDay: UserCompletionsSummary | GroupCompletionsSummary
}
