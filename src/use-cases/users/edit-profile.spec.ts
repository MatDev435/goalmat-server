import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { EditProfileUseCase } from './edit-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditProfileUseCase

describe('Edit Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to change username', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      newUsername: 'NewUsername',
    })

    expect(success).toBe(true)
    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        username: 'NewUsername',
      })
    )
  })

  it('should not be able to change username of an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        newUsername: 'NewUsername',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
