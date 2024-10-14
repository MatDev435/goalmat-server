import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { CreateGoalUseCase } from './create-goal'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateGoalUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to create a goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    const { goal } = await sut.execute({
      userId: 'user-01',
      name: 'New goal',
      description: 'New goal description',
      desiredWeeklyFrequency: 5,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(goal)
  })

  it('should not be able to create a goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        name: 'New goal',
        description: 'New goal description',
        desiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
