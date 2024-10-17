import { Group } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface EditGroupUseCaseRequest {
  userId: string
  groupId: string
  newName: string
  newDescription: string
}

interface EditGroupUseCaseResponse {
  group: Group
}

export class EditGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    newName,
    newDescription,
  }: EditGroupUseCaseRequest): Promise<EditGroupUseCaseResponse> {
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

    group.name = newName
    group.description = newDescription

    await this.groupsRepository.save(group)

    return { group }
  }
}
