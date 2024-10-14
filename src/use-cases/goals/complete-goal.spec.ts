import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { CompleteGoalUseCase } from './complete-goal'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository'
import { makeGoalCompletion } from '../../../test/factories/make-goal-completion'
import { GoalAlreadyCompletedError } from '../_errors/goal-already-completed-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CompleteGoalUseCase

describe('Complete Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CompleteGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryGoalCompletionsRepository,
      inMemoryUsersRepository
    )

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-01',
        desiredWeeklyFrequency: 5,
      })
    )
  })

  it('should be able to complete a goal', async () => {
    const { goalCompletion } = await sut.execute({
      userId: 'user-01',
      goalId: 'goal-01',
    })

    expect(inMemoryGoalCompletionsRepository.items[0]).toEqual(goalCompletion)
  })

  it('should not be able to complete a goal twice in same week', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-02',
        ownerId: 'user-01',
        desiredWeeklyFrequency: 1,
      })
    )

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        userId: 'user-01',
        goalId: 'goal-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-02',
      })
    ).rejects.toBeInstanceOf(GoalAlreadyCompletedError)
  })

  it('should not be able to complete a goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to complete a goal from other user', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-02',
        ownerId: 'user-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalId: 'goal-02',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
