import { StorageRepository } from '../../repositories/storage/storage-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { NotAllowedError } from '../errors/not-allowed-error'

interface EditProfileUseCaseRequest {
  userId: string
  newUsername: string
}

interface EditProfileUseCaseResponse {
  success: boolean
}

export class EditProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    newUsername,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new NotAllowedError()
    }

    user.username = newUsername

    await this.usersRepository.save(user)

    return { success: true }
  }
}
