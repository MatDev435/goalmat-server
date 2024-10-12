import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { GoalCompletion } from '@prisma/client'
import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'
import { GoalAlreadyCompletedError } from '../errors/goal-already-completed-error'

interface CompleteGoalUseCaseRequest {
  userId: string
  goalId: string
}

interface CompleteGoalUseCaseResponse {
  goalCompletion: GoalCompletion
}

export class CompleteGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private goalCompletionsRepository: GoalCompletionsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    goalId,
  }: CompleteGoalUseCaseRequest): Promise<CompleteGoalUseCaseResponse> {
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

    const goalCompletions = await this.goalCompletionsRepository.fetchByGoalId(
      goal.id
    )

    if (goalCompletions.length >= goal.desiredWeeklyFrequency) {
      throw new GoalAlreadyCompletedError()
    }

    const goalCompletion = await this.goalCompletionsRepository.create({
      goalId: goal.id,
      userId,
    })

    return { goalCompletion }
  }
}
