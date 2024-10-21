import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface DeleteGroupGoalUseCaseRequest {
  userId: string
  goalId: string
}

interface DeleteGroupGoalUseCaseResponse {
  success: boolean
}

export class DeleteGroupGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    goalId,
  }: DeleteGroupGoalUseCaseRequest): Promise<DeleteGroupGoalUseCaseResponse> {
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

    await this.goalsRepository.delete(goal.id)

    return { success: true }
  }
}
