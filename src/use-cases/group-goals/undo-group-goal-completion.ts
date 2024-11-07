import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { MembersRepository } from '../../repositories/members-repository'
import { GroupGoalCompletionsRepository } from '../../repositories/group-goal-completions-repository'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface UndoGroupGoalCompletionUseCaseRequest {
  userId: string
  groupId: string
  completionId: string
}

interface UndoGroupGoalCompletionUseCaseResponse {
  success: boolean
}

export class UndoGroupGoalCompletionUseCase {
  constructor(
    private membersRepository: MembersRepository,
    private groupGoalCompletionsRepository: GroupGoalCompletionsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    completionId,
  }: UndoGroupGoalCompletionUseCaseRequest): Promise<UndoGroupGoalCompletionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const member = await this.membersRepository.findByGroupId(userId, groupId)

    if (!member) {
      throw new ResourceNotFoundError()
    }

    const completion =
      await this.groupGoalCompletionsRepository.findById(completionId)

    if (!completion) {
      throw new ResourceNotFoundError()
    }

    if (completion.memberId !== member.id) {
      throw new NotAllowedError()
    }

    await this.groupGoalCompletionsRepository.delete(completion.id)

    return { success: true }
  }
}
