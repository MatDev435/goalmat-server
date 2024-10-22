import { UsersRepository } from '../../repositories/users-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { GroupGoalCompletion } from '@prisma/client'
import { MembersRepository } from '../../repositories/members-repository'
import { GroupGoalCompletionsRepository } from '../../repositories/group-goal-completions-repository'
import { GoalAlreadyCompletedError } from '../_errors/goal-already-completed-error'

interface CompleteGroupGoalUseCaseRequest {
  userId: string
  groupId: string
  goalId: string
}

interface CompleteGroupGoalUseCaseResponse {
  groupGoalCompletion: GroupGoalCompletion
}

export class CompleteGroupGoalUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private membersRepository: MembersRepository,
    private groupGoalCompletionsRepository: GroupGoalCompletionsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    groupId,
    goalId,
  }: CompleteGroupGoalUseCaseRequest): Promise<CompleteGroupGoalUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    const member = await this.membersRepository.findByGroupId(userId, groupId)

    if (!member) {
      throw new ResourceNotFoundError()
    }

    const completions =
      await this.groupGoalCompletionsRepository.fetchMemberGroupGoalCompletions(
        goal.id,
        member.id
      )

    if (completions.length >= goal.desiredWeeklyFrequency) {
      throw new GoalAlreadyCompletedError()
    }

    const groupGoalCompletion =
      await this.groupGoalCompletionsRepository.create({
        goalId: goal.id,
        memberId: member.id,
        groupId,
      })

    member.points += 1

    await this.membersRepository.save(member)

    return { groupGoalCompletion }
  }
}
