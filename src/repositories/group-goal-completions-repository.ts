import { GroupGoalCompletion, Prisma } from '@prisma/client'

export interface GroupGoalCompletionsRepository {
  fetchMemberGroupGoalCompletions(
    goalId: string,
    memberId: string
  ): Promise<GroupGoalCompletion[]>
  create(
    groupGoalCompletion: Prisma.GroupGoalCompletionUncheckedCreateInput
  ): Promise<GroupGoalCompletion>
}
