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
        isEmailVerified: false,
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
        codeType: 'EMAIL_VERIFICATION',
      })
    )

    const { success } = await sut.execute({
      code: '1234',
    })

    expect(success).toBe(true)
    expect(inMemoryUsersRepository.items[0].isEmailVerified).toEqual(true)
  })

  it('should not be able to verify user email with an inexistent code', async () => {
    await expect(() =>
      sut.execute({
        code: 'inexistent-code',
      })
    ).rejects.toBeInstanceOf(InvalidCodeError)
  })

  it('should not be able to verify user email with an expired code', async () => {
    vi.setSystemTime(new Date(2024, 9, 16, 0, 0, 0))

    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'user-01',
        code: '1234',
        codeType: 'EMAIL_VERIFICATION',
      })
    )

    vi.setSystemTime(new Date(2024, 9, 16, 0, 16, 0))

    await expect(() =>
      sut.execute({
        code: '1234',
      })
    ).rejects.toBeInstanceOf(InvalidCodeError)
  })

  it('should not be able to verify inexistent user email', async () => {
    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'inexistent-user-id',
        code: '1234',
        codeType: 'EMAIL_VERIFICATION',
      })
    )

    await expect(() =>
      sut.execute({
        code: '1234',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to verify user email twice', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-02',
        isEmailVerified: true,
      })
    )

    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'user-02',
        code: '1234',
        codeType: 'EMAIL_VERIFICATION',
      })
    )

    await expect(() =>
      sut.execute({
        code: '1234',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyVerifiedError)
  })
})
