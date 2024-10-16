import { EncrypterRepository } from '../../repositories/cryptography/encrypter'
import { UserCodesRepository } from '../../repositories/user-codes-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { InvalidResetTokenError } from '../_errors/invalid-reset-token-error'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface ResetPasswordUseCaseRequest {
  token: string
  newPassword: string
}

interface ResetPasswordUseCaseResponse {
  success: boolean
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userCodesRepository: UserCodesRepository,
    private encrypterRepository: EncrypterRepository
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const existentToken = await this.userCodesRepository.findByCode(token)

    if (!existentToken) {
      throw new InvalidResetTokenError()
    }

    const now = new Date()

    if (now > existentToken.expiresAt) {
      throw new InvalidResetTokenError()
    }

    const user = await this.usersRepository.findById(existentToken.userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.passwordHash = await this.encrypterRepository.hash(newPassword)

    await this.usersRepository.save(user)
    await this.userCodesRepository.delete(existentToken.id)

    return { success: true }
  }
}
