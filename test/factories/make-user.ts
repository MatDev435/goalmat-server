import { User } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

export function makeUser(override: Partial<User> = {}) {
  const user = {
    id: randomUUID,
    username: faker.internet.userName(),
    avatarUrl: faker.internet.url(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    ...override,
  } as User

  return user
}
