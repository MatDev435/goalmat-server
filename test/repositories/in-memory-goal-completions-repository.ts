import { Prisma, GoalCompletion } from '@prisma/client'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'

export class InMemoryGoalCompletionsRepository
  implements GoalCompletionsRepository
{
  public items: GoalCompletion[] = []

  async findById(goalCompletionId: string): Promise<GoalCompletion | null> {
    const goalCompletion = this.items.find(item => item.id === goalCompletionId)

    if (!goalCompletion) {
      return null
    }

    return goalCompletion
  }

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

  async delete(goalCompletionId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === goalCompletionId)

    this.items.splice(itemIndex, 1)
  }
}
