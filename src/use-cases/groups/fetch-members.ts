import { Member } from '@prisma/client'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { MembersRepository } from '../../repositories/members-repository'

interface FetchMembersUseCaseRequest {
  groupId: string
}

interface FetchMembersUseCaseResponse {
  members: Member[]
}

export class FetchMembersUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private membersRepository: MembersRepository
  ) {}

  async execute({
    groupId,
  }: FetchMembersUseCaseRequest): Promise<FetchMembersUseCaseResponse> {
    const group = await this.groupsRepository.findById(groupId)

    if (!group) {
      throw new ResourceNotFoundError()
    }

    const members = await this.membersRepository.fetchByPoints(groupId)

    return { members }
  }
}
