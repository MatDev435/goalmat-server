import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { WeekSummary } from '../../types/week-summary'
import { SummariesRepository } from '../../repositories/summaries-repository'

interface GetUserLastWeekSummaryUseCaseRequest {
  userId: string
}

interface GetUserLastWeekSummaryUseCaseResponse {
  summary: WeekSummary
}

export class GetUserLastWeekSummaryUseCase {
  constructor(
    private summariesRepository: SummariesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserLastWeekSummaryUseCaseRequest): Promise<GetUserLastWeekSummaryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const summary =
      await this.summariesRepository.getUserLastWeekSummary(userId)

    return { summary }
  }
}
