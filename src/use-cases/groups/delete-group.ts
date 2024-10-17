import { UsersRepository } from '../../repositories/users-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface DeleteGroupUseCaseRequest {
  userId: string
  groupId: string
}

interface DeleteGroupUseCaseResponse {
  success: boolean
}

export class DeleteGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
  }: DeleteGroupUseCaseRequest): Promise<DeleteGroupUseCaseResponse> {
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

    await this.groupsRepository.delete(group.id)

    return { success: true }
  }
}
