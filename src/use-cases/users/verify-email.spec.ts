import { makeUser } from '../../../test/factories/make-user'
import { makeUserCode } from '../../../test/factories/make-user-code'
import { InMemoryUserCodesRepository } from '../../../test/repositories/in-memory-user-codes-repository'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { EmailAlreadyVerifiedError } from '../_errors/email-already-verified-error'
import { InvalidCodeError } from '../_errors/invalid-code-error'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { VerifyEmailUseCase } from './verify-email'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUserCodesRepository: InMemoryUserCodesRepository
let sut: VerifyEmailUseCase

describe('Verify Email Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUserCodesRepository = new InMemoryUserCodesRepository()
    sut = new VerifyEmailUseCase(
      inMemoryUsersRepository,
      inMemoryUserCodesRepository
    )

    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        email: 'johndoe@example.com',
      })
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to verify user email', async () => {
    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'user-01',
        code: '1234',
      })
    )

    const { success } = await sut.execute({
      email: 'johndoe@example.com',
      code: '1234',
    })

    expect(success).toBe(true)
    expect(inMemoryUsersRepository.items[0].isEmailVerified).toEqual(true)
  })

  it('should not be able to verify an email of an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        code: '1234',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to verify an email with inexistent code', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        code: 'inexistent-code',
      })
    ).rejects.toBeInstanceOf(InvalidCodeError)
  })

  it('should not be able to verify user email twice', async () => {
    inMemoryUsersRepository.items[0].isEmailVerified = true

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        code: '1234',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyVerifiedError)
  })

  it('should not be able to verify an email with invalid code', async () => {
    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        code: '1234',
      })
    )

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        code: 'wrong-code',
      })
    ).rejects.toBeInstanceOf(InvalidCodeError)
  })
})
