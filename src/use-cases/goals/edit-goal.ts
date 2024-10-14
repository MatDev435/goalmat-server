import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface EditGoalUseCaseRequest {
  userId: string
  goalId: string
  newName: string
  newDescription?: string
  newDesiredWeeklyFrequency: number
}

interface EditGoalUseCaseResponse {
  goal: Goal
}

export class EditGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    goalId,
    newName,
    newDescription,
    newDesiredWeeklyFrequency,
  }: EditGoalUseCaseRequest): Promise<EditGoalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (userId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    goal.name = newName
    goal.description = newDescription ?? null
    goal.desiredWeeklyFrequency = newDesiredWeeklyFrequency

    await this.goalsRepository.save(goal)

    return { goal }
  }
}
