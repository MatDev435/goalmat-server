import { Group } from '@prisma/client'
import { UsersRepository } from '../../repositories/users-repository'
import { GroupsRepository } from '../../repositories/groups-repository'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'
import { NotAllowedError } from '../_errors/not-allowed-error'
import { customAlphabet } from 'nanoid'
import { generateId } from '../../utils/generate-id'

interface CreateGroupUseCaseRequest {
  userId: string
  name: string
  description?: string
}

interface CreateGroupUseCaseResponse {
  group: Group
}

export class CreateGroupUseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    name,
    description,
  }: CreateGroupUseCaseRequest): Promise<CreateGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (user.isPlus === false) {
      throw new NotAllowedError()
    }

    const inviteCode = generateId()

    const group = await this.groupsRepository.create({
      ownerId: user.id,
      name,
      description,
      inviteCode,
    })

    return { group }
  }
}
