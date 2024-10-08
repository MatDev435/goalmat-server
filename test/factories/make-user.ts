import { User } from '@prisma/client'
import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<User> = {}) {
  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    ...override,
  } as User

  return user
}
