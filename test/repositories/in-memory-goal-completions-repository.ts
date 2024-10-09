import { Prisma, GoalCompletion } from '@prisma/client'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'

export class InMemoryGoalCompletionsRepository
  implements GoalCompletionsRepository
{
  public items: GoalCompletion[] = []

  async create(
    goalCompletion: Prisma.GoalCompletionUncheckedCreateInput
  ): Promise<GoalCompletion> {
    const newGoalCompletion = {
      goalId: goalCompletion.goalId,
      userId: goalCompletion.userId,
    } as GoalCompletion

    this.items.push(newGoalCompletion)

    return newGoalCompletion
  }
}
