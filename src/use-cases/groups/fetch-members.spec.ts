import { makeUser } from '../../../test/factories/make-user'
import { InMemoryGroupsRepository } from '../../../test/repositories/in-memory-groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { makeGroup } from '../../../test/factories/make-group'
import { InMemoryMembersRepository } from '../../../test/repositories/in-memory-members-repository'
import { FetchMembersUseCase } from './fetch-members'
import { makeMember } from '../../../test/factories/make-member'

let inMemoryGroupsRepository: InMemoryGroupsRepository
let inMemoryMembersRepository: InMemoryMembersRepository
let sut: FetchMembersUseCase

describe('Fetch Members Use Case', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    inMemoryMembersRepository = new InMemoryMembersRepository()
    sut = new FetchMembersUseCase(
      inMemoryGroupsRepository,
      inMemoryMembersRepository
    )
  })

  it('should be able to fetch group members', async () => {
    inMemoryGroupsRepository.items.push(
      makeGroup({
        id: 'group-01',
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-01',
        groupId: 'group-01',
        points: 5,
      })
    )

    inMemoryMembersRepository.items.push(
      makeMember({
        id: 'member-02',
        groupId: 'group-01',
        points: 10,
      })
    )

    const { members } = await sut.execute({
      groupId: 'group-01',
    })

    expect(members).toEqual([
      expect.objectContaining({
        id: 'member-02',
        points: 10,
      }),

      expect.objectContaining({
        id: 'member-01',
        points: 5,
      }),
    ])
  })

  it('should not be able to fetch members from an inexistent group', async () => {
    await expect(() =>
      sut.execute({
        groupId: 'group-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
