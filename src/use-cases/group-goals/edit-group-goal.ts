import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { Goal } from '@prisma/client'

interface EditGroupGoalUseCaseRequest {
  userId: string
  goalId: string
  newName: string
  newDescription: string
  newDesiredWeeklyFrequency: number
}

interface EditGroupGoalUseCaseResponse {
  goal: Goal
}

export class EditGroupGoalUseCase {
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
  }: EditGroupGoalUseCaseRequest): Promise<EditGroupGoalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.isPlus === false) {
      throw new NotAllowedError()
    }

    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (userId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    goal.name = newName
    goal.description = newDescription
    goal.desiredWeeklyFrequency = newDesiredWeeklyFrequency

    await this.goalsRepository.save(goal)

    return { goal }
  }
}
