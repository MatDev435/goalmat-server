import { Goal, Prisma } from '@prisma/client'

export interface GoalsRepository {
  fetchByUserId(userId: string): Promise<Goal[]>
  save(goal: Goal): Promise<Goal>
  create(goal: Prisma.GoalUncheckedCreateInput): Promise<Goal>
  delete(goalId: string): Promise<void>
}
