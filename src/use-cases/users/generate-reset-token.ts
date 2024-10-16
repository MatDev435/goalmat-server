import shortid from 'shortid'
import { EmailServiceRepository } from '../../repositories/email/email-service-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { UserCodesRepository } from '../../repositories/user-codes-repository'
import { myDayjs } from '../../utils/dayjs'

interface GenerateResetTokenUseCaseRequest {
  email: string
}

interface GenerateResetTokenUseCaseResponse {
  success: boolean
}

export class GenerateResetTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userCodesRepository: UserCodesRepository,
    private emailServiceRepository: EmailServiceRepository
  ) {}

  async execute({
    email,
  }: GenerateResetTokenUseCaseRequest): Promise<GenerateResetTokenUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const resetToken = shortid.generate()
    const expiresAt = myDayjs().add(20, 'minute').toDate()

    await this.userCodesRepository.create({
      userId: user.id,
      code: resetToken,
      codeType: 'PASSWORD_RESET',
      expiresAt,
    })

    await this.emailServiceRepository.sendPasswordReset(email, resetToken)

    return { success: true }
  }
}
