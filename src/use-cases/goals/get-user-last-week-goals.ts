import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface GetUserLastWeekGoalsUseCaseRequest {
  userId: string
}

interface GetUserLastWeekGoalsUseCaseResponse {
  goals: Goal[]
}

export class GetUserLastWeekGoalsUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserLastWeekGoalsUseCaseRequest): Promise<GetUserLastWeekGoalsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goals = await this.goalsRepository.fetchUserLastWeekGoals(userId)

    return { goals }
  }
}
