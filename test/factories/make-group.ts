import { faker } from '@faker-js/faker'
import { Group } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import shortid from 'shortid'

export function makeGroup(override: Partial<Group> = {}) {
  const group = {
    id: randomUUID(),
    ownerId: randomUUID(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    inviteCode: shortid.generate(),
    createdAt: new Date(),
    ...override,
  } as Group

  return group
}
