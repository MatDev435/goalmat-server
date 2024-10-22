import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { makeGoal } from '../../../test/factories/make-goal'
import { CompleteGroupGoalUseCase } from './complete-group-goal'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { InMemoryGroupGoalCompletionsRepository } from '../../../test/repositories/in-memory-group-goal-completions-repository'
import { makeMember } from '../../../test/factories/make-member'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeGroupGoalCompletion } from '../../../test/factories/make-group-goal-completion'
import { GoalAlreadyCompletedError } from '../_errors/goal-already-completed-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryGroupGoalCompletionsRepository: InMemoryGroupGoalCompletionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CompleteGroupGoalUseCase

describe('Complete Group Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryGroupGoalCompletionsRepository =
      new InMemoryGroupGoalCompletionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CompleteGroupGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryMembersRepository,
      inMemoryGroupGoalCompletionsRepository,
      inMemoryUsersRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to complete a group goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 14, 0, 0, 0))

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-02',
        desiredWeeklyFrequency: 1,
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-01',
        groupId: 'group-01',
        userId: 'user-01',
        points: 0,
      })
    )

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        goalId: 'goal-01',
        memberId: 'member-01',
        groupId: 'group-01',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 21, 0, 0, 0))

    await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      goalId: 'goal-01',
    })

    expect(inMemoryGroupGoalCompletionsRepository.items).toHaveLength(2)
    expect(inMemoryMembersRepository.items[0].points).toEqual(1)
  })

  it('should not be able to complete a group goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user-id',
        groupId: 'group-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to complete a group goal for an inexistent goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        goalId: 'inexistent-goal-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to complete a group goal for an inexistent member', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
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
        groupId: 'group-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to complete a group goal twice in week', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-01',
        ownerId: 'user-02',
        desiredWeeklyFrequency: 1,
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-01',
        groupId: 'group-01',
        userId: 'user-01',
        points: 0,
      })
    )

    inMemoryGroupGoalCompletionsRepository.items.push(
      makeGroupGoalCompletion({
        goalId: 'goal-01',
        memberId: 'member-01',
        groupId: 'group-01',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        goalId: 'goal-01',
      })
    ).rejects.toBeInstanceOf(GoalAlreadyCompletedError)
  })
})
