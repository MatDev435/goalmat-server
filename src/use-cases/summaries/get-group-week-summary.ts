import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { WeekSummary } from '../../types/week-summary'
import { SummariesRepository } from '../../repositories/summaries-repository'
import { UsersRepository } from '../../repositories/users-repository'

interface GetGroupWeekSummaryUseCaseRequest {
  userId: string
  groupId: string
}

interface GetGroupWeekSummaryUseCaseResponse {
  summary: WeekSummary
}

export class GetGroupWeekSummaryUseCase {
  constructor(
    private summariesRepository: SummariesRepository,
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
  }: GetGroupWeekSummaryUseCaseRequest): Promise<GetGroupWeekSummaryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const group = await this.groupsRepository.findById(groupId)

    if (!group) {
      throw new ResourceNotFoundError()
    }

    const summary = await this.summariesRepository.getGroupWeekSummary(groupId)

    return { summary }
  }
}
