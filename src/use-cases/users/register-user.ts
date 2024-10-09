import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'
import { EncrypterRepository } from '../../repositories/cryptography/encrypter'

interface RegisterUserUseCaseRequest {
  username: string
  email: string
  password: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: EncrypterRepository
  ) {}

  async execute({
    username,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }

    const passwordHash = await this.encrypter.hash(password)

    const user = await this.usersRepository.create({
      username,
      email,
      passwordHash,
    })

    return { user }
  }
}
