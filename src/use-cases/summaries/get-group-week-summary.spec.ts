import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository'
import { InMemorySummariesRepository } from '../../../test/repositories/in-memory-summaries-repository'
import { GetGroupWeekSummaryUseCase } from './get-group-week-summary'
import { InMemoryGroupGoalCompletionsRepository } from '../../../test/repositories/in-memory-group-goal-completions-repository'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { makeUser } from '../../../test/factories/make-user'
import { makeGoal } from '../../../test/factories/make-goal'
import { makeGroup } from '../../../test/factories/make-group'
import { makeGroupGoalCompletion } from '../../../test/factories/make-group-goal-completion'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGroupGoalCompletionsRepository: InMemoryGroupGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemorySummariesRepository: InMemorySummariesRepository
let sut: GetGroupWeekSummaryUseCase

describe('Get Group Week Summary Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGroupGoalCompletionsRepository =
      new InMemoryGroupGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemorySummariesRepository = new InMemorySummariesRepository(
      inMemoryGoalsRepository,
      inMemoryGoalCompletionsRepository,
      inMemoryGroupGoalCompletionsRepository
    )
    sut = new GetGroupWeekSummaryUseCase(
      inMemorySummariesRepository,
      inMemoryGroupsRepository,
      inMemoryUsersRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get group week summary', async () => {
    vi.setSystemTime(new Date(2024, 9, 7, 0, 0, 0))

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryGroupsRepository.items.push(
      makeGroup({
        id: 'group-01',
      })
    )

    for (let i = 0; i <= 3; i++) {
      inMemoryGoalsRepository.items.push(
        makeGoal({
          id: `goal-0${i}`,
          ownerId: 'user-01',
          groupId: 'group-01',
          name: `Goal 0${i}`,
          desiredWeeklyFrequency: i,
        })
      )
    }

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        groupId: 'group-01',
        goalId: 'goal-01',
      })
    )

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        groupId: 'group-01',
        goalId: 'goal-03',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 9, 0, 0, 0))

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        groupId: 'group-01',
        goalId: 'goal-02',
      })
    )

    const { summary } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
    })

    expect(summary).toEqual({
      total: 6,
      completed: 3,
      goalsPerDay: {
        '2024-10-07': expect.arrayContaining([
          expect.objectContaining({
            goalName: 'Goal 01',
          }),

          expect.objectContaining({
            goalName: 'Goal 03',
          }),
        ]),

        '2024-10-09': expect.arrayContaining([
          expect.objectContaining({
            goalName: 'Goal 02',
          }),
        ]),
      },
    })
  })

  it('should not be able to get group week summary with an inexistent group', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'inexistent-group-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
