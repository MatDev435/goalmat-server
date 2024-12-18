import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'
import { GoalsRepository } from '../../src/repositories/goals-repository'
import { GroupGoalCompletionsRepository } from '../../src/repositories/group-goal-completions-repository'
import { SummariesRepository } from '../../src/repositories/summaries-repository'
import {
  GroupCompletionsSummary,
  UserCompletionsSummary,
  WeekSummary,
} from '../../src/types/week-summary'

export class InMemorySummariesRepository implements SummariesRepository {
  constructor(
    private goalsRepository: GoalsRepository,
    private goalCompletionsRepository: GoalCompletionsRepository,
    private groupGoalCompletionsRepository: GroupGoalCompletionsRepository
  ) {}

  async getUserWeekSummary(userId: string): Promise<WeekSummary> {
    const goals = await this.goalsRepository.fetchUserWeekGoals(userId)
    const goalCompletions =
      await this.goalCompletionsRepository.fetchWeekGoalCompletions(userId)

    const total = goals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency,
      0
    )
    const completed = goalCompletions.length
    const goalsPerDay = goalCompletions.reduce((acc, completion) => {
      const goal = goals.find(item => item.id === completion.goalId)

      if (goal) {
        const completionObject = {
          id: completion.id,
          goalName: goal.name,
          completedAt: completion.completedAt.toString(),
        }

        const dataKey = completion.completedAt.toISOString().split('T')[0]

        if (acc[dataKey]) {
          acc[dataKey].push(completionObject)
        } else {
          acc[dataKey] = [completionObject]
        }
      }

      return acc
    }, {} as UserCompletionsSummary)

    const summary = {
      total,
      completed,
      goalsPerDay,
    } as WeekSummary

    return summary
  }

  async getUserLastWeekSummary(userId: string): Promise<WeekSummary> {
    const goals = await this.goalsRepository.fetchUserLastWeekGoals(userId)
    const goalCompletions =
      await this.goalCompletionsRepository.fetchLastWeekGoalCompletions(userId)

    const total = goals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency,
      0
    )
    const completed = goalCompletions.length
    const goalsPerDay = goalCompletions.reduce((acc, completion) => {
      const goal = goals.find(item => item.id === completion.goalId)

      if (goal) {
        const completionObject = {
          id: completion.id,
          goalName: goal.name,
          completedAt: completion.completedAt.toString(),
        }

        const dataKey = completion.completedAt.toISOString().split('T')[0]

        if (acc[dataKey]) {
          acc[dataKey].push(completionObject)
        } else {
          acc[dataKey] = [completionObject]
        }
      }

      return acc
    }, {} as UserCompletionsSummary)

    const summary = {
      total,
      completed,
      goalsPerDay,
    } as WeekSummary

    return summary
  }

  async getGroupWeekSummary(groupId: string): Promise<WeekSummary> {
    const goals = await this.goalsRepository.fetchGroupWeekGoals(groupId)
    const goalCompletions =
      await this.groupGoalCompletionsRepository.fetchGroupGoalCompletions(
        groupId
      )

    const total = goals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency,
      0
    )
    const completed = goalCompletions.length
    const goalsPerDay = goalCompletions.reduce((acc, completion) => {
      const goal = goals.find(item => item.id === completion.goalId)

      if (goal) {
        const completionObject = {
          id: completion.id,
          user: completion.memberId,
          goalName: goal.name,
          completedAt: completion.completedAt.toString(),
        }

        const dataKey = completion.completedAt.toISOString().split('T')[0]

        if (acc[dataKey]) {
          acc[dataKey].push(completionObject)
        } else {
          acc[dataKey] = [completionObject]
        }
      }

      return acc
    }, {} as GroupCompletionsSummary)

    const summary = {
      total,
      completed,
      goalsPerDay,
    } as WeekSummary

    return summary
  }
}
