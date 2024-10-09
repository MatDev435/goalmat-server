import { GoalCompletion, Prisma } from '@prisma/client'

export interface GoalCompletionsRepository {
  findById(goalCompletionId: string): Promise<GoalCompletion | null>
  create(
    goalCompletion: Prisma.GoalCompletionUncheckedCreateInput
  ): Promise<GoalCompletion>
  delete(goalCompletionId: string): Promise<void>
}
