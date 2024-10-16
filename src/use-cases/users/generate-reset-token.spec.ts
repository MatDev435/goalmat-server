import { makeUser } from '../../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository'
import { GenerateResetTokenUseCase } from './generate-reset-token'
import { InMemoryEmailServiceRepository } from '../../../test/repositories/in-memory-email-service-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { InMemoryUserCodesRepository } from '../../../test/repositories/in-memory-user-codes-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUserCodesRepository: InMemoryUserCodesRepository
let inMemoryEmailServiceRepository: InMemoryEmailServiceRepository
let sut: GenerateResetTokenUseCase

describe('Generate Reset Token Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUserCodesRepository = new InMemoryUserCodesRepository()
    inMemoryEmailServiceRepository = new InMemoryEmailServiceRepository()
    sut = new GenerateResetTokenUseCase(
      inMemoryUsersRepository,
      inMemoryUserCodesRepository,
      inMemoryEmailServiceRepository
    )
  })

  it('should be able to generate a reset token', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: '123456',
      })
    )

    const { success } = await sut.execute({
      email: 'johndoe@example.com',
    })

    expect(success).toBe(true)
    expect(inMemoryEmailServiceRepository.items).toHaveLength(1)
  })

  it('should not be able to generate a reset token for an inexistent user', async () => {
    await expect(() =>
      sut.execute({
        email: 'inexsitent@example.com',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
