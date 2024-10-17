import { Group, Prisma } from '@prisma/client'
import { GroupsRepository } from '../../src/repositories/groups-repository'

export class InMemoryGroupsRepository implements GroupsRepository {
  public items: Group[] = []

  async findById(groupId: string): Promise<Group | null> {
    const group = this.items.find(item => item.id === groupId)

    if (!group) {
      return null
    }

    return group
  }

  async save(group: Group): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === group.id)

    this.items[itemIndex] = group
  }

  async create(group: Prisma.GroupUncheckedCreateInput): Promise<Group> {
    const newGroup = {
      id: group.id,
      name: group.name,
      description: group.description,
      inviteCode: group.inviteCode,
      createdAt: group.createdAt,
      ownerId: group.ownerId,
    } as Group

    this.items.push(newGroup)

    return newGroup
  }

  async delete(groupId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === groupId)

    this.items.splice(itemIndex, 1)
  }
}
