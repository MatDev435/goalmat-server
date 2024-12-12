import { Goal, GroupGoalCompletion, Prisma } from '@prisma/client'

export interface GroupGoalCompletionsRepository {
  findById(groupGoalCompletionId: string): Promise<GroupGoalCompletion | null>
  fetchMemberGroupGoalCompletions(
    goalId: string,
    memberId: string
  ): Promise<GroupGoalCompletion[]>
  fetchGroupGoalCompletions(groupId: string): Promise<GroupGoalCompletion[]>
  create(
    groupGoalCompletion: Prisma.GroupGoalCompletionUncheckedCreateInput
  ): Promise<GroupGoalCompletion>
  delete(groupGoalCompletionId: string): Promise<void>
}
