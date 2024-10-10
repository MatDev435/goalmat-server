import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { WeekSummary } from '../../types/week-summary'
import { SummariesRepository } from '../../repositories/summaries-repository'

interface GetUserWeekSummaryUseCaseRequest {
  userId: string
}

interface GetUserWeekSummaryUseCaseResponse {
  summary: WeekSummary
}

export class GetUserWeekSummaryUseCase {
  constructor(
    private summariesRepository: SummariesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserWeekSummaryUseCaseRequest): Promise<GetUserWeekSummaryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const summary = await this.summariesRepository.getUserWeekSummary(userId)

    return { summary }
  }
}
