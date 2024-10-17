import { faker } from '@faker-js/faker'
import { Group } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { generateId } from '../../src/utils/generate-id'

export function makeGroup(override: Partial<Group> = {}) {
  const group = {
    id: randomUUID(),
    ownerId: randomUUID(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    inviteCode: generateId(),
    createdAt: new Date(),
    ...override,
  } as Group

  return group
}
