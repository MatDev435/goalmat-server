import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { EncrypterRepository } from '../../repositories/cryptography/encrypter'
import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import { NotAllowedError } from '../_errors/not-allowed-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: EncrypterRepository
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    if (user.isEmailVerified === false) {
      throw new NotAllowedError()
    }

    const isPasswordValid = await this.encrypter.compare(
      password,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
