import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { EditGroupUseCase } from './edit-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGroup } from '../../../test/factories/make-group'

let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditGroupUseCase

describe('Edit Group Use Case', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditGroupUseCase(
      inMemoryGroupsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to edit group infos', async () => {
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
        name: 'old',
        description: 'old',
      })
    )

    const { group } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      newName: 'New group',
      newDescription: 'New group description',
    })

    expect(inMemoryGroupsRepository.items[0]).toEqual(group)
  })

  it('should not be able to edit group infos with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        newName: 'New group',
        newDescription: 'New group description',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit group infos if user is not plus', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: false,
      })
    )

    inMemoryGroupsRepository.items.push(
      makeGroup({
        id: 'group-01',
        ownerId: 'user-01',
        name: 'old',
        description: 'old',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        newName: 'New group',
        newDescription: 'New group description',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit group infos if user is not owner', async () => {
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
        name: 'old',
        description: 'old',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        newName: 'New group',
        newDescription: 'New group description',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
