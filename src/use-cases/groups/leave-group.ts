import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { MembersRepository } from '../../repositories/members-repository'

interface LeaveGroupUseCaseRequest {
  userId: string
  groupId: string
}

interface LeaveGroupUseCaseResponse {
  success: boolean
}

export class LeaveGroupUseCase {
  constructor(
    private membersRepository: MembersRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
  }: LeaveGroupUseCaseRequest): Promise<LeaveGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const member = await this.membersRepository.findByGroupId(userId, groupId)

    if (!member) {
      throw new ResourceNotFoundError()
    }

    await this.membersRepository.leaveGroup(member.id)

    return { success: true }
  }
}
