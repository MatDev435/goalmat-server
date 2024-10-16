import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { InMemoryEmailServiceRepository } from '../../../test/repositories/in-memory-email-service-repository'
import { InMemoryUserCodesRepository } from '../../../test/repositories/in-memory-user-codes-repository'
import { ResendEmailVerificationUseCase } from './resend-email-verification'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { makeUserCode } from '../../../test/factories/make-user-code'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryEmailServiceRepository: InMemoryEmailServiceRepository
let inMemoryUserCodesRepository: InMemoryUserCodesRepository
let sut: ResendEmailVerificationUseCase

describe('Resend Email Verification Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryEmailServiceRepository = new InMemoryEmailServiceRepository()
    inMemoryUserCodesRepository = new InMemoryUserCodesRepository()
    sut = new ResendEmailVerificationUseCase(
      inMemoryUsersRepository,
      inMemoryEmailServiceRepository,
      inMemoryUserCodesRepository
    )
  })

  it('should be able to resend email verification', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        id: 'user-01',
        email: 'johndoe@example.com',
      })
    )

    inMemoryUserCodesRepository.items.push(
      makeUserCode({
        userId: 'user-01',
        code: 'old_code',
        codeType: 'EMAIL_VERIFICATION',
      })
    )

    const { success } = await sut.execute({
      email: 'johndoe@example.com',
    })

    expect(success).toBe(true)
    expect(inMemoryEmailServiceRepository.items).toHaveLength(1)
    expect(inMemoryUserCodesRepository.items).toHaveLength(1)
  })

  it('should not be able to resend email verification for an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
