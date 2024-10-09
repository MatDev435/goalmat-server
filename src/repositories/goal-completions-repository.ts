import { GoalCompletion, Prisma } from '@prisma/client'

export interface GoalCompletionsRepository {
  create(
    goalCompletion: Prisma.GoalCompletionUncheckedCreateInput
  ): Promise<GoalCompletion>
}
