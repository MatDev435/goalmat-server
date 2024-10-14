import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface GetUserWeekGoalsUseCaseRequest {
  userId: string
}

interface GetUserWeekGoalsUseCaseResponse {
  goals: Goal[]
}

export class GetUserWeekGoalsUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserWeekGoalsUseCaseRequest): Promise<GetUserWeekGoalsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goals = await this.goalsRepository.fetchUserWeekGoals(userId)

    return { goals }
  }
}
