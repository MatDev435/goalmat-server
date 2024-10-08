import { FakeEncrypter } from '../../../test/cryptography/fake-encrypter'
import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'
import { RegisterUserUseCase } from './register-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(user)
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
