import { GoalCompletion } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeGoalCompletion(override: Partial<GoalCompletion> = {}) {
  const goalCompletion = {
    id: randomUUID(),
    goalId: randomUUID(),
    userId: randomUUID(),
    ...override,
  } as GoalCompletion

  return goalCompletion
}
