import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { LeaveGroupUseCase } from './leave-group'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { makeMember } from '../../../test/factories/make-member'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

let inMemoryMembersRepository: InMemoryMembersRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: LeaveGroupUseCase

describe('Leave Group Use Case', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new LeaveGroupUseCase(
      inMemoryMembersRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to leave', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        isPlus: true,
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        userId: 'user-01',
        groupId: 'group-01',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      groupId: 'group-01',
    })

    expect(success).toBe(true)
    expect(inMemoryMembersRepository.items).toHaveLength(0)
  })

  it('should not be able to leave if user does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        groupId: 'group-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to leave if member does not exists', async () => {
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
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
