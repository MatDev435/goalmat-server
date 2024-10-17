import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { EmailAlreadyInUseError } from '../_errors/email-already-in-use-error'
import { EncrypterRepository } from '../../repositories/cryptography/encrypter'
import { EmailServiceRepository } from '../../repositories/email/email-service-repository'
import { UserCodesRepository } from '../../repositories/user-codes-repository'
import { myDayjs } from '../../utils/dayjs'
import { generateId } from '../../utils/generate-id'

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
    private encrypter: EncrypterRepository,
    private emailService: EmailServiceRepository,
    private userCodesRepository: UserCodesRepository
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

    const code = generateId()

    await this.userCodesRepository.create({
      userId: user.id,
      code,
      codeType: 'EMAIL_VERIFICATION',
      expiresAt: myDayjs().add(15, 'minute').toDate(),
    })

    await this.emailService.sendEmailVerification(email, code)

    return { user }
  }
}
