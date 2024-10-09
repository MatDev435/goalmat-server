import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { EditGoalUseCase } from './edit-goal'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { NotAllowedError } from '../errors/not-allowed-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditGoalUseCase

describe('Edit Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditGoalUseCase(inMemoryGoalsRepository, inMemoryUsersRepository)

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )
  })

  it('should be able to edit a goal', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-01',
      })
    )

    const { goal } = await sut.execute({
      userId: 'user-01',
      goalId: 'goal-01',
      newName: 'New name',
      newDescription: 'New description',
      newDesiredWeeklyFrequency: 3,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(goal)
  })

  it('should not be able to edit a goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        goalId: 'goal-01',
        newName: 'New name',
        newDescription: 'New description',
        newDesiredWeeklyFrequency: 3,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a goal from other user', async () => {
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
        newDescription: 'New description',
        newDesiredWeeklyFrequency: 3,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
