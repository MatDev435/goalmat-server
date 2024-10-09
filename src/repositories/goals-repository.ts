import { Goal, Prisma } from '@prisma/client'

export interface GoalsRepository {
  findById(goalId: string): Promise<Goal | null>
  fetchByUserId(userId: string): Promise<Goal[]>
  save(goal: Goal): Promise<Goal>
  create(goal: Prisma.GoalUncheckedCreateInput): Promise<Goal>
  delete(goalId: string): Promise<void>
}
