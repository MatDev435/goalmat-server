import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { makeGoal } from '../../../test/factories/make-goal'
import { NotAllowedError } from '../errors/not-allowed-error'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository'
import { UndoGoalCompletionUseCase } from './undo-goal-completion'
import { makeGoalCompletion } from '../../../test/factories/make-goal-completion'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UndoGoalCompletionUseCase

describe('Undo Goal Completion Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UndoGoalCompletionUseCase(
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
      })
    )
  })

  it('should be able to undo goal completion', async () => {
    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        id: 'goal-completion-01',
        goalId: 'goal-01',
        userId: 'user-01',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      goalCompletionId: 'goal-completion-01',
    })

    expect(success).toBe(true)
    expect(inMemoryGoalCompletionsRepository.items).toHaveLength(0)
  })

  it('should not be able to undo goal completion with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        goalCompletionId: 'goal-completion-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to undo goal completion from other user', async () => {
    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        id: 'goal-completion-01',
        goalId: 'goal-01',
        userId: 'user-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        goalCompletionId: 'goal-completion-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
