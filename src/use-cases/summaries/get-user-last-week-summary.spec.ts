import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { makeGoal } from '../../../test/factories/make-goal'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository'
import { GetUserWeekSummaryUseCase } from './get-user-week-summary'
import { InMemorySummariesRepository } from '../../../test/repositories/in-memory-summaries-repository'
import { makeGoalCompletion } from '../../../test/factories/make-goal-completion'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserLastWeekSummaryUseCase } from './get-user-last-week-summary'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySummariesRepository: InMemorySummariesRepository
let sut: GetUserLastWeekSummaryUseCase

describe('Get User Last Week Summary Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemorySummariesRepository = new InMemorySummariesRepository(
      inMemoryGoalsRepository,
      inMemoryGoalCompletionsRepository
    )
    sut = new GetUserLastWeekSummaryUseCase(
      inMemorySummariesRepository,
      inMemoryUsersRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get user last week summary', async () => {
    vi.setSystemTime(new Date(2024, 8, 30, 0, 0, 0))

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-01',
        name: 'Goal 01',
        desiredWeeklyFrequency: 3,
      })
    )

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-02',
        ownerId: 'user-01',
        name: 'Goal 02',
        desiredWeeklyFrequency: 2,
      })
    )

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-03',
        ownerId: 'user-01',
        name: 'Goal 03',
        desiredWeeklyFrequency: 2,
      })
    )

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        userId: 'user-01',
        goalId: 'goal-01',
      })
    )

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        userId: 'user-01',
        goalId: 'goal-03',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 3, 0, 0, 0))

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        userId: 'user-01',
        goalId: 'goal-02',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 8, 0, 0, 0))

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        userId: 'user-01',
        goalId: 'goal-01',
      })
    )
    const { summary } = await sut.execute({
      userId: 'user-01',
    })

    expect(summary).toEqual({
      total: 7,
      completed: 3,
      goalsPerDay: {
        '2024-09-30': expect.arrayContaining([
          expect.objectContaining({
            goalName: 'Goal 01',
          }),

          expect.objectContaining({
            goalName: 'Goal 03',
          }),
        ]),

        '2024-10-03': expect.arrayContaining([
          expect.objectContaining({
            goalName: 'Goal 02',
          }),
        ]),
      },
    })
  })

  it('should not be able to get user last week summary with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
