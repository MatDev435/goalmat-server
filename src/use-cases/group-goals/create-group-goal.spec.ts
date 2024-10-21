import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository'
import { CreateGroupGoalUseCase } from './create-group-goal'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { makeGroup } from '../../../test/factories/make-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateGroupGoalUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalsRepository = new InMemoryGoalsRepository()
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateGroupGoalUseCase(
      inMemoryGoalsRepository,
      inMemoryGroupsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to create a group goal', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    inMemoryGroupsRepository.items.push(
      makeGroup({
        id: 'group-01',
        ownerId: 'user-01',
      })
    )

    const { groupGoal } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      name: 'New goal',
      description: 'New goal description',
      desiredWeeklyFrequency: 5,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(groupGoal)
  })

  it('should not be able to create a group goal with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user-id',
        groupId: 'group-01',
        name: 'New goal',
        description: 'New goal description',
        desiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a group goal if user is not plus', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: false,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        name: 'New goal',
        description: 'New goal description',
        desiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create a group goal for an inexistent group', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'inexistent-group-id',
        name: 'New goal',
        description: 'New goal description',
        desiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a group goal if user is not owner', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    inMemoryGroupsRepository.items.push(
      makeGroup({
        id: 'group-01',
        ownerId: 'user-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        name: 'New goal',
        description: 'New goal description',
        desiredWeeklyFrequency: 5,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
