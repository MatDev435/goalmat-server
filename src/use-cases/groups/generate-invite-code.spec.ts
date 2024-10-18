import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { EditGroupUseCase } from './edit-group'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGroup } from '../../../test/factories/make-group'
import { GenerateInviteCodeUseCase } from './generate-invite-code'

let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GenerateInviteCodeUseCase

describe('Generate Invite Code Use Case', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GenerateInviteCodeUseCase(
      inMemoryGroupsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to generate a new invite code', async () => {
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

    const { inviteCode } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
    })

    expect(inMemoryGroupsRepository.items[0].inviteCode).toEqual(inviteCode)
  })

  it('should not be able to generate a new invite code with an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to generate a new invite code if user is not plus', async () => {
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

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to generate a new invite code if user is not owner', async () => {
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
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
