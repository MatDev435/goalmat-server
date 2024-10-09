import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreateGoalUseCaseRequest {
  userId: string
  name: string
  description?: string
  desiredWeeklyFrequency: number
}

interface CreateGoalUseCaseResponse {
  goal: Goal
}

export class CreateGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    name,
    description,
    desiredWeeklyFrequency,
  }: CreateGoalUseCaseRequest): Promise<CreateGoalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalsRepository.create({
      ownerId: user.id,
      name,
      description,
      desiredWeeklyFrequency,
    })

    return { goal }
  }
}
