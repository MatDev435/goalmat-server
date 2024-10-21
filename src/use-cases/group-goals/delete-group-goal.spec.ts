import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { DeleteGroupGoalUseCase } from './delete-group-goal'
import { makeGroup } from '../../../test/factories/make-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGoal } from '../../../test/factories/make-goal'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteGroupGoalUseCase

describe('Delete Group Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteGroupGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to delete a group goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

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

  it('should not be able to delete a group goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a group goal if user is not plus', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: false,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete an inexistent group goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'inexistent-goal-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a group goal if user is not owner', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

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
