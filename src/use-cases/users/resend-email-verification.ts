import { UsersRepository } from '../../repositories/users-repository'
import { EmailServiceRepository } from '../../repositories/email/email-service-repository'
import { UserCodesRepository } from '../../repositories/user-codes-repository'
import { myDayjs } from '../../utils/dayjs'
import shortid from 'shortid'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

interface ResendEmailVerificationUseCaseRequest {
  email: string
}

interface ResendEmailVerificationUseCaseResponse {
  success: boolean
}

export class ResendEmailVerificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailServiceRepository,
    private userCodesRepository: UserCodesRepository
  ) {}

  async execute({
    email,
  }: ResendEmailVerificationUseCaseRequest): Promise<ResendEmailVerificationUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const existentCode = await this.userCodesRepository.findByUserId(
      user.id,
      'EMAIL_VERIFICATION'
    )

    if (existentCode) {
      await this.userCodesRepository.delete(existentCode.id)
    }

    const code = shortid.generate()
    const expiresAt = myDayjs().add(15, 'minute').toDate()

    await this.userCodesRepository.create({
      userId: user.id,
      code,
      codeType: 'EMAIL_VERIFICATION',
      expiresAt,
    })

    await this.emailService.sendEmailVerification(email, code)

    return { success: true }
  }
}
