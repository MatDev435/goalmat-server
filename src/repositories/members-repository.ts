import { Member } from '@prisma/client'

export interface MembersRepository {
  isUserInAnyGroup(userId: string): Promise<boolean>
  joinGroup(userId: string, groupId: string): Promise<Member>
  leaveGroup(userId: string, groupId: string): Promise<void>
}
