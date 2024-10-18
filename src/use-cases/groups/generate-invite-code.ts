import { UsersRepository } from '../../repositories/users-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { generateId } from '../../utils/generate-id'

interface GenerateInviteCodeUseCaseRequest {
  userId: string
  groupId: string
}

interface GenerateInviteCodeUseCaseResponse {
  inviteCode: string
}

export class GenerateInviteCodeUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
  }: GenerateInviteCodeUseCaseRequest): Promise<GenerateInviteCodeUseCaseResponse> {
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

    const inviteCode = generateId()

    group.inviteCode = inviteCode

    await this.groupsRepository.save(group)

    return { inviteCode }
  }
}
