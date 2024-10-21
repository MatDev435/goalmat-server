import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { MembersRepository } from '../../repositories/members-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface KickMemberUseCaseRequest {
  userId: string
  groupId: string
  memberId: string
}

interface KickMemberUseCaseResponse {
  success: boolean
}

export class KickMemberUseCase {
  constructor(
    private membersRepository: MembersRepository,
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    memberId,
  }: KickMemberUseCaseRequest): Promise<KickMemberUseCaseResponse> {
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

    if (group.ownerId !== userId) {
      throw new NotAllowedError()
    }

    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      throw new ResourceNotFoundError()
    }

    await this.membersRepository.leaveGroup(member.id)

    return { success: true }
  }
}
