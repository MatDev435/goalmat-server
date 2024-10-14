import { EncrypterRepository } from '../../repositories/cryptography/encrypter'
import { UsersRepository } from '../../repositories/users-repository'
import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface ChangePasswordUseCaseRequest {
  userId: string
  oldPassword: string
  newPassword: string
}

interface ChangePasswordUseCaseResponse {
  success: boolean
}

export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: EncrypterRepository
  ) {}

  async execute({
    userId,
    oldPassword,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const isPasswordValid = await this.encrypter.compare(
      oldPassword,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    user.passwordHash = await this.encrypter.hash(newPassword)

    await this.usersRepository.save(user)

    return { success: true }
  }
}
