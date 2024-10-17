import { Member } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { MembersRepository } from '../../repositories/members-repository'
import { InvalidInviteCodeError } from '../_errors/invalid-invite-code-error'

interface JoinGroupUseCaseRequest {
  userId: string
  groupId: string
  inviteCode: string
}

interface JoinGroupUseCaseResponse {
  member: Member
}

export class JoinGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private membersRepository: MembersRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    inviteCode,
  }: JoinGroupUseCaseRequest): Promise<JoinGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const isUserInAnyGroup = await this.membersRepository.isUserInAnyGroup(
      user.id
    )

    if (isUserInAnyGroup && user.isPlus === false) {
      throw new NotAllowedError()
    }

    const group = await this.groupsRepository.findById(groupId)

    if (!group) {
      throw new ResourceNotFoundError()
    }

    if (group.inviteCode !== inviteCode) {
      throw new InvalidInviteCodeError()
    }

    const member = await this.membersRepository.joinGroup(user.id, group.id)

    return { member }
  }
}
