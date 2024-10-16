import { makeUser } from '../../../test/factories/make-user'
import { FakeEncrypter } from '../../../test/repositories/cryptography/fake-encrypter'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { ResetPasswordUseCase } from './reset-password'
import { InMemoryUserCodesRepository } from '../../../test/repositories/in-memory-user-codes-repository'
import { makeUserCode } from '../../../test/factories/make-user-code'
import { InvalidResetTokenError } from '../_errors/invalid-reset-token-error'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUserCodesRepository: InMemoryUserCodesRepository
let fakeEncrypter: FakeEncrypter
let sut: ResetPasswordUseCase

describe('Reset Password Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUserCodesRepository = new InMemoryUserCodesRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new ResetPasswordUseCase(
      inMemoryUsersRepository,
      inMemoryUserCodesRepository,
      fakeEncrypter
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to reset the password', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        passwordHash: 'old',
      })
    )

    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'user-01',
        code: '1234',
        codeType: 'PASSWORD_RESET',
      })
    )

    const { success } = await sut.execute({
      token: '1234',
      newPassword: '123456',
    })

    expect(success).toBe(true)
    expect(inMemoryUsersRepository.items[0].passwordHash).toEqual(
      '123456-hashed'
    )
  })

  it('should not be able to reset user password with an invalid token', async () => {
    await expect(() =>
      sut.execute({
        token: 'invalid-token',
        newPassword: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidResetTokenError)
  })

  it('should not be able to reset the password with an expired token', async () => {
    vi.setSystemTime(new Date(2024, 9, 16, 0, 0, 0))

    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        code: '1234',
        codeType: 'PASSWORD_RESET',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 16, 0, 21, 0))

    await expect(() =>
      sut.execute({
        token: '1234',
        newPassword: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidResetTokenError)
  })

  it('should not be able to reset the password of an inexistent user', async () => {
    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        code: '1234',
        codeType: 'PASSWORD_RESET',
      })
    )

    await expect(() =>
      sut.execute({
        token: '1234',
        newPassword: '123456',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
