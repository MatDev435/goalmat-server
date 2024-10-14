import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface DeleteGoalUseCaseRequest {
  userId: string
  goalId: string
}

interface DeleteGoalUseCaseResponse {
  success: boolean
}

export class DeleteGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    goalId,
  }: DeleteGoalUseCaseRequest): Promise<DeleteGoalUseCaseResponse> {
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

    await this.goalsRepository.delete(goal.id)

    return { success: true }
  }
}
