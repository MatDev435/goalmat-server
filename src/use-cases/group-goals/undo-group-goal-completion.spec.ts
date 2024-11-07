import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { InMemoryGroupGoalCompletionsRepository } from '../../../test/repositories/in-memory-group-goal-completions-repository'
import { makeMember } from '../../../test/factories/make-member'
import { makeGroupGoalCompletion } from '../../../test/factories/make-group-goal-completion'
import { UndoGroupGoalCompletionUseCase } from './undo-group-goal-completion'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryGroupGoalCompletionsRepository: InMemoryGroupGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UndoGroupGoalCompletionUseCase

describe('Undo Group Goal Completion Use Case', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryGroupGoalCompletionsRepository =
      new InMemoryGroupGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UndoGroupGoalCompletionUseCase(
      inMemoryMembersRepository,
      inMemoryGroupGoalCompletionsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to undo a group goal completion', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-01',
        groupId: 'group-01',
        userId: 'user-01',
      })
    )

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        id: 'completion-01',
        memberId: 'member-01',
        groupId: 'group-01',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      completionId: 'completion-01',
    })

    expect(success).toBe(true)
    expect(inMemoryGroupGoalCompletionsRepository.items).toHaveLength(0)
  })

  it('should not be able to undo a group goal completion with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        groupId: 'group-01',
        completionId: 'completion-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to undo a group goal completion with an inexistent member', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        completionId: 'completion-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to undo a group goal completion from other user', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        groupId: 'group-01',
        userId: 'user-01',
      })
    )

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        id: 'completion-01',
        memberId: 'member-02',
        groupId: 'group-01',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        completionId: 'completion-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
