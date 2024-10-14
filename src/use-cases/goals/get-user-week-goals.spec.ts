import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { GetUserWeekGoalsUseCase } from './get-user-week-goals'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserWeekGoalsUseCase

describe('Get User Week Goals Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserWeekGoalsUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )
  })

  it('should be able to list user goals', async () => {
    for (let i = 0; i < 10; i++) {
      inMemoryGoalsRepository.items.push(
        makeGoal({
          id: `goal-${i}`,
          ownerId: 'user-01',
        })
      )
    }

    const { goals } = await sut.execute({
      userId: 'user-01',
    })

    expect(goals).toHaveLength(10)
    expect(goals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'goal-1',
        }),

        expect.objectContaining({
          id: 'goal-2',
        }),
      ])
    )
  })

  it('should not be able to list goals with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
