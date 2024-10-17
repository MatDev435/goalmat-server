import { Member } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeMember(override: Partial<Member> = {}) {
  const member = {
    id: randomUUID(),
    userId: randomUUID(),
    groupId: randomUUID(),
    points: 0,
    joinedAt: new Date(),
    ...override,
  } as Member

  return member
}
