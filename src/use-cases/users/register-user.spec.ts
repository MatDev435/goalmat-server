import { FakeEncrypter } from '../../../test/repositories/cryptography/fake-encrypter'
import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { EmailAlreadyInUseError } from '../_errors/email-already-in-use-error'
import { RegisterUserUseCase } from './register-user'
import { InMemoryEmailServiceRepository } from '../../../test/repositories/in-memory-email-service-repository'
import { InMemoryUserCodesRepository } from '../../../test/repositories/in-memory-user-codes-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let inMemoryEmailServiceRepository: InMemoryEmailServiceRepository
let inMemoryUserCodesRepository: InMemoryUserCodesRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    inMemoryEmailServiceRepository = new InMemoryEmailServiceRepository()
    inMemoryUserCodesRepository = new InMemoryUserCodesRepository()
    sut = new RegisterUserUseCase(
      inMemoryUsersRepository,
      fakeEncrypter,
      inMemoryEmailServiceRepository,
      inMemoryUserCodesRepository
    )
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(user)
    expect(user.isEmailVerified).toBe(false)
    expect(inMemoryEmailServiceRepository.items).toHaveLength(1)
    expect(inMemoryUserCodesRepository.items).toHaveLength(1)
  })

  it('should hash users password upon registration', async () => {
    const { user } = await sut.execute({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordHashed = await fakeEncrypter.compare(
      '123456',
      user.passwordHash
    )

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register an user with same email', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
      })
    )

    await expect(() =>
      sut.execute({
        username: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})
