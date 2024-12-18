import { Prisma, GoalCompletion } from '@prisma/client'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'
import { myDayjs } from '../../src/utils/dayjs'

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

  async fetchByGoalId(goalId: string): Promise<GoalCompletion[]> {
    const startOfWeek = myDayjs().startOf('isoWeek').toDate()
    const endOfWeek = myDayjs().endOf('isoWeek').toDate()

    const completionsUpToWeek = this.items.filter(
      item =>
        item.goalId === goalId &&
        item.completedAt >= startOfWeek &&
        item.completedAt <= endOfWeek
    )

    return completionsUpToWeek
  }

  async fetchWeekGoalCompletions(userId: string): Promise<GoalCompletion[]> {
    const startOfWeek = myDayjs().startOf('isoWeek').toDate()
    const endOfWeek = myDayjs().endOf('isoWeek').toDate()

    const goalCompletions = this.items
      .filter(item => item.userId === userId)
      .filter(
        item => item.completedAt >= startOfWeek && item.completedAt <= endOfWeek
      )

    return goalCompletions
  }

  async fetchLastWeekGoalCompletions(
    userId: string
  ): Promise<GoalCompletion[]> {
    const startOfLastWeek = myDayjs()
      .startOf('isoWeek')
      .subtract(1, 'week')
      .toDate()
    const endOfLastWeek = myDayjs()
      .endOf('isoWeek')
      .subtract(1, 'week')
      .toDate()

    const goalCompletions = this.items
      .filter(item => item.userId === userId)
      .filter(
        item =>
          item.completedAt >= startOfLastWeek &&
          item.completedAt <= endOfLastWeek
      )

    return goalCompletions
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
