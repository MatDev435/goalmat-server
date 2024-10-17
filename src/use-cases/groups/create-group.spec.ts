import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { CreateGroupUseCase } from './create-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'

let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateGroupUseCase

describe('Create Group Use Case', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateGroupUseCase(
      inMemoryGroupsRepository,
      inMemoryMembersRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to create a group', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    const { group } = await sut.execute({
      userId: 'user-01',
      name: 'New group',
      description: 'New group description',
    })

    expect(inMemoryGroupsRepository.items[0]).toEqual(group)
    expect(inMemoryMembersRepository.items).toHaveLength(1)
  })

  it('should not be able to create a group with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        name: 'New group',
        description: 'New group description',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a group if user is not plus', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: false,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        name: 'New group',
        description: 'New group description',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
