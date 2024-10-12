import { GoalCompletion, Prisma } from '@prisma/client'

export interface GoalCompletionsRepository {
  findById(goalCompletionId: string): Promise<GoalCompletion | null>
  fetchByGoalId(goalId: string): Promise<GoalCompletion[]>
  fetchWeekGoalCompletions(userId: string): Promise<GoalCompletion[]>
  fetchLastWeekGoalCompletions(userId: string): Promise<GoalCompletion[]>
  create(
    goalCompletion: Prisma.GoalCompletionUncheckedCreateInput
  ): Promise<GoalCompletion>
  delete(goalCompletionId: string): Promise<void>
}
