import { Goal, Prisma } from '@prisma/client'
import { GoalsRepository } from '../../src/repositories/goals-repository'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  async findById(goalId: string): Promise<Goal | null> {
    const goal = this.items.find(item => item.id === goalId)

    if (!goal) {
      return null
    }

    return goal
  }

  async fetchByUserId(userId: string): Promise<Goal[]> {
    const goals = this.items.filter(item => item.ownerId === userId)

    return goals
  }

  async save(goal: Goal): Promise<Goal> {
    const itemIndex = this.items.findIndex(item => item.id === goal.id)

    this.items[itemIndex] = goal

    return goal
  }

  async create(goal: Prisma.GoalUncheckedCreateInput): Promise<Goal> {
    const newGoal = {
      ownerId: goal.ownerId,
      name: goal.name,
      description: goal.description,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
    } as Goal

    this.items.push(newGoal)

    return newGoal
  }

  async delete(goalId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === goalId)

    this.items.splice(itemIndex, 1)
  }
}
