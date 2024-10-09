import { faker } from '@faker-js/faker'
import { Goal } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeGoal(override: Partial<Goal> = {}) {
  const goal = {
    id: randomUUID(),
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    desiredWeeklyFrequency: Math.floor(Math.random() * 7) - 1,
    ...override,
  } as Goal

  return goal
}
