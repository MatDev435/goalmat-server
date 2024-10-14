import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { GetUserLastWeekGoalsUseCase } from './get-user-last-week-goals'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserLastWeekGoalsUseCase

describe('Get User Last Week Goals Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserLastWeekGoalsUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to list user last week goals', async () => {
    vi.setSystemTime(new Date(2024, 8, 30, 0, 0, 0))

    for (let i = 0; i < 2; i++) {
      inMemoryGoalsRepository.items.push(
        makeGoal({
          id: `goal-${i}`,
          ownerId: 'user-01',
        })
      )
    }

    vi.setSystemTime(new Date(2024, 9, 7, 0, 0, 0))

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-2',
        ownerId: 'user-01',
      })
    )

    const { goals } = await sut.execute({
      userId: 'user-01',
    })

    expect(goals).toHaveLength(2)
    expect(goals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'goal-1',
        }),

        expect.objectContaining({
          id: 'goal-1',
        }),
      ])
    )
  })

  it('should not be able to list last week goals with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
