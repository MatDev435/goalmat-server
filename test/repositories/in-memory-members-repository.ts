import { Member } from '@prisma/client'
import { MembersRepository } from '../../src/repositories/members-repository'

export class InMemoryMembersRepository implements MembersRepository {
  public items: Member[] = []

  async findByGroupId(userId: string, groupId: string): Promise<Member | null> {
    const member = this.items.find(
      item => item.userId === userId && item.groupId === groupId
    )

    if (!member) {
      return null
    }

    return member
  }

  async isUserInAnyGroup(userId: string): Promise<boolean> {
    const memberIn = this.items.some(item => item.userId === userId)

    if (memberIn) {
      return true
    }

    return false
  }

  async joinGroup(userId: string, groupId: string): Promise<Member> {
    const member = {
      userId,
      groupId,
      points: 0,
      joinedAt: new Date(),
    } as Member

    this.items.push(member)

    return member
  }

  async leaveGroup(memberId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === memberId)

    this.items.splice(itemIndex, 1)
  }
}
