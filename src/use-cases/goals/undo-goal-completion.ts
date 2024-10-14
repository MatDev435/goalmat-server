import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'

interface UndoGoalCompletionUseCaseRequest {
  userId: string
  goalCompletionId: string
}

interface UndoGoalCompletionUseCaseResponse {
  success: boolean
}

export class UndoGoalCompletionUseCase {
  constructor(
    private goalCompletionsRepository: GoalCompletionsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    goalCompletionId,
  }: UndoGoalCompletionUseCaseRequest): Promise<UndoGoalCompletionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goalCompletion =
      await this.goalCompletionsRepository.findById(goalCompletionId)

    if (!goalCompletion) {
      throw new ResourceNotFoundError()
    }

    if (userId !== goalCompletion.userId) {
      throw new NotAllowedError()
    }

    await this.goalCompletionsRepository.delete(goalCompletion.id)

    return { success: true }
  }
}
