import { Member } from '@prisma/client'

export interface MembersRepository {
  findById(memberId: string): Promise<Member | null>
  findByGroupId(userId: string, groupId: string): Promise<Member | null>
  fetchByPoints(groupId: string): Promise<Member[]>
  isUserInAnyGroup(userId: string): Promise<boolean>
  save(member: Member): Promise<Member>
  joinGroup(userId: string, groupId: string): Promise<Member>
  leaveGroup(memberId: string): Promise<void>
}
