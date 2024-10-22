import { GroupGoalCompletion } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeGroupGoalCompletion(
  override: Partial<GroupGoalCompletion> = {}
) {
  const groupGoalCompletion = {
    id: randomUUID(),
    goalId: randomUUID(),
    memberId: randomUUID(),
    groupId: randomUUID(),
    completedAt: new Date(),
    ...override,
  } as GroupGoalCompletion

  return groupGoalCompletion
}
