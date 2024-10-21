import { Member } from '@prisma/client'

export interface MembersRepository {
  findById(memberId: string): Promise<Member | null>
  findByGroupId(userId: string, groupId: string): Promise<Member | null>
  isUserInAnyGroup(userId: string): Promise<boolean>
  joinGroup(userId: string, groupId: string): Promise<Member>
  leaveGroup(memberId: string): Promise<void>
}
