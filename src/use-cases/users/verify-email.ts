import { UserCodesRepository } from '../../repositories/user-codes-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { EmailAlreadyVerifiedError } from '../_errors/email-already-verified-error'
import { InvalidCodeError } from '../_errors/invalid-code-error'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface VerifyEmailUseCaseRequest {
  email: string
  code: string
}

interface VerifyEmailUseCaseResponse {
  success: boolean
}

export class VerifyEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userCodesRepository: UserCodesRepository
  ) {}

  async execute({
    email,
    code,
  }: VerifyEmailUseCaseRequest): Promise<VerifyEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.isEmailVerified) {
      throw new EmailAlreadyVerifiedError()
    }

    const existentCode = await this.userCodesRepository.findByCode(code)

    if (!existentCode) {
      throw new InvalidCodeError()
    }

    if (existentCode.code !== code) {
      throw new InvalidCodeError()
    }

    const now = new Date()

    if (now > existentCode.expiresAt) {
      throw new InvalidCodeError()
    }

    user.isEmailVerified = true

    await this.usersRepository.save(user)
    await this.userCodesRepository.delete(existentCode.id)

    return { success: true }
  }
}
