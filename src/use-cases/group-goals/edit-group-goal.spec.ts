import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { EditGroupGoalUseCase } from './edit-group-goal'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGoal } from '../../../test/factories/make-goal'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditGroupGoalUseCase

describe('Edit Group Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditGroupGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to edit a group goal', async () => {
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
        name: 'old',
        description: 'old',
        desiredWeeklyFrequency: 1,
      })
    )

    const { goal } = await sut.execute({
      userId: 'user-01',
      goalId: 'goal-01',
      newName: 'New name',
      newDescription: 'New Description',
      newDesiredWeeklyFrequency: 5,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(goal)
  })

  it('should not be able to edit a group goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-01',
        newName: 'New name',
        newDescription: 'New Description',
        newDesiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a group goal if user is not plus', async () => {
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
        newName: 'New name',
        newDescription: 'New Description',
        newDesiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit an inexistent group goal', async () => {
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
        newName: 'New name',
        newDescription: 'New Description',
        newDesiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a group goal if user is not owner', async () => {
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
        newName: 'New name',
        newDescription: 'New Description',
        newDesiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
