import { Goal } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { GroupsRepository } from '../../repositories/groups-repository'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface CreateGroupGoalUseCaseRequest {
  userId: string
  groupId: string
  name: string
  description?: string
  desiredWeeklyFrequency: number
}

interface CreateGroupGoalUseCaseResponse {
  groupGoal: Goal
}

export class CreateGroupGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    name,
    description,
    desiredWeeklyFrequency,
  }: CreateGroupGoalUseCaseRequest): Promise<CreateGroupGoalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.isPlus === false) {
      throw new NotAllowedError()
    }

    const group = await this.groupsRepository.findById(groupId)

    if (!group) {
      throw new ResourceNotFoundError()
    }

    if (userId !== group.ownerId) {
      throw new NotAllowedError()
    }

    const groupGoal = await this.goalsRepository.create({
      ownerId: user.id,
      groupId: group.id,
      name,
      description,
      desiredWeeklyFrequency,
    })

    return { groupGoal }
  }
}
