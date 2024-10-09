import { makeUser } from '../../../test/factories/make-user'
import { FakeEncrypter } from '../../../test/repositories/cryptography/fake-encrypter'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ChangePasswordUseCase } from './change-password'
import { EditProfileUseCase } from './edit-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: ChangePasswordUseCase

describe('Change Password Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new ChangePasswordUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to change the password', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        passwordHash: await fakeEncrypter.hash('old'),
      })
    )

    const { success } = await sut.execute({
      userId: 'user-01',
      oldPassword: 'old',
      newPassword: 'new',
    })

    expect(success).toBe(true)
    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        passwordHash: await fakeEncrypter.hash('new'),
      })
    )
  })

  it('should not be able to change the password of an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'inexistent-user',
        oldPassword: 'old',
        newPassword: 'new',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change the password of an inexistent user', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        passwordHash: await fakeEncrypter.hash('123456'),
      })
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        oldPassword: 'wrong',
        newPassword: 'new',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
