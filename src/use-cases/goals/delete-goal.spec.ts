import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { DeleteGoalUseCase } from './delete-goal'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { NotAllowedError } from '../_errors/not-allowed-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteGoalUseCase

describe('Delete Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )
  })

  it('should be able to delete a goal', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-01',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      goalId: 'goal-01',
    })

    expect(success).toBe(true)
    expect(inMemoryGoalsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a goal from other user', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
