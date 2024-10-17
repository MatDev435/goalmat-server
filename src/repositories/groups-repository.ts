import { Group, Prisma } from '@prisma/client'

export interface GroupsRepository {
  findById(groupId: string): Promise<Group | null>
  save(group: Group): Promise<void>
  create(group: Prisma.GroupUncheckedCreateInput): Promise<Group>
  delete(groupId: string): Promise<void>
}
