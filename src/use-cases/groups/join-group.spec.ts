import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { JoinGroupUseCase } from './join-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGroup } from '../../../test/factories/make-group'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { makeMember } from '../../../test/factories/make-member'
import { InvalidInviteCodeError } from '../_errors/invalid-invite-code-error'

let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: JoinGroupUseCase

describe('Join Group Use Case', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new JoinGroupUseCase(
      inMemoryGroupsRepository,
      inMemoryMembersRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to join in group', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    const group = makeGroup({
      id: 'group-01',
      ownerId: 'user-01',
    })

    inMemoryGroupsRepository.items.push(group)

    const { member } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
      inviteCode: group.inviteCode,
    })

    expect(inMemoryMembersRepository.items[0]).toEqual(member)
  })

  it('should not be able to join in group with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        inviteCode: 'abc123',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to join in more of 1 group if user is not plus', async () => {
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
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        userId: 'user-01',
        groupId: 'group-02',
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        inviteCode: 'abc123',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to join in an inexistent group', async () => {
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
        inviteCode: 'abc123',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to join in group with wrong invite code', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    const group = makeGroup({
      id: 'group-01',
      ownerId: 'user-01',
      inviteCode: 'abc123',
    })

    inMemoryGroupsRepository.items.push(group)

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
        inviteCode: 'invalid-invite-code',
      })
    ).rejects.toBeInstanceOf(InvalidInviteCodeError)
  })
})
