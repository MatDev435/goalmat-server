import { GroupGoalCompletion, Prisma } from '@prisma/client'
import { GroupGoalCompletionsRepository } from '../../src/repositories/group-goal-completions-repository'
import { myDayjs } from '../../src/utils/dayjs'

export class InMemoryGroupGoalCompletionsRepository
  implements GroupGoalCompletionsRepository
{
  public items: GroupGoalCompletion[] = []

  async fetchMemberGroupGoalCompletions(
    goalId: string,
    memberId: string
  ): Promise<GroupGoalCompletion[]> {
    const startOfWeek = myDayjs().startOf('isoWeek').toDate()
    const endOfWeek = myDayjs().endOf('isoWeek').toDate()

    const completions = this.items.filter(
      item =>
        item.goalId === goalId &&
        item.memberId === memberId &&
        item.completedAt >= startOfWeek &&
        item.completedAt <= endOfWeek
    )

    return completions
  }

  async create(
    groupGoalCompletion: Prisma.GroupGoalCompletionUncheckedCreateInput
  ): Promise<GroupGoalCompletion> {
    const newGroupGoalCompletion = {
      goalId: groupGoalCompletion.goalId,
      memberId: groupGoalCompletion.memberId,
      groupId: groupGoalCompletion.groupId,
      completedAt: new Date(),
    } as GroupGoalCompletion

    this.items.push(newGroupGoalCompletion)

    return newGroupGoalCompletion
  }
}
