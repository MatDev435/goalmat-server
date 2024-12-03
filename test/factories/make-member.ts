import { Member } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeMember(override: Partial<Member> = {}) {
  const member = {
    id: randomUUID(),
    userId: randomUUID(),
    groupId: randomUUID(),
    points: Math.round(Math.random() * 100 - 1),
    joinedAt: new Date(),
    ...override,
  } as Member

  return member
}
