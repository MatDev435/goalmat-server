import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserGoalsUseCaseRequest {
  userId: string
}

interface GetUserGoalsUseCaseResponse {
  goals: Goal[]
}

export class GetUserGoalsUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserGoalsUseCaseRequest): Promise<GetUserGoalsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goals = await this.goalsRepository.fetchByUserId(userId)

    return { goals }
  }
}
