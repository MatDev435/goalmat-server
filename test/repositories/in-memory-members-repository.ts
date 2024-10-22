import { Member } from '@prisma/client'
import { MembersRepository } from '../../src/repositories/members-repository'

export class InMemoryMembersRepository implements MembersRepository {
  public items: Member[] = []

  async findById(memberId: string): Promise<Member | null> {
    const member = this.items.find(item => item.id === memberId)

    if (!member) {
      return null
    }

    return member
  }

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

  async save(member: Member): Promise<Member> {
    const itemIndex = this.items.findIndex(item => item.id === member.id)

    this.items[itemIndex] = member

    return member
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
