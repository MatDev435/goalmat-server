import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { makeMember } from '../../../test/factories/make-member'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { KickMemberUseCase } from './kick-member'
import { makeGroup } from '../../../test/factories/make-group'
import { NotAllowedError } from '../_errors/not-allowed-error'

let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: KickMemberUseCase

describe('Kick Member Use Case', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new KickMemberUseCase(
      inMemoryMembersRepository,
      inMemoryGroupsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to kick a member', async () => {
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

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-01',
        groupId: 'group-02',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      memberId: 'member-01',
    })

    expect(success).toBe(true)
    expect(inMemoryMembersRepository.items).toHaveLength(0)
  })

  it('should not be able to kick a member if user not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        memberId: 'member-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to kick a member if user is not plus', async () => {
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
        memberId: 'member-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to kick a member from an inexistent group', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        memberId: 'member-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to kick a member if user is not owner', async () => {
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
        memberId: 'member-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to kick an inexistent member', async () => {
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

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        memberId: 'inexistent-member-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
