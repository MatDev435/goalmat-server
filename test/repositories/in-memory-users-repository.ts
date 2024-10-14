import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../../src/repositories/users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find(item => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async save(user: User): Promise<User> {
    const itemIndex = this.items.findIndex(item => item.id === user.id)

    this.items[itemIndex] = user

    return user
  }

  async create(user: Prisma.UserUncheckedCreateInput): Promise<User> {
    const newUser = {
      id: randomUUID(),
      username: user.username,
      email: user.email,
      isEmailVerified: false,
      isPlus: false,
      passwordHash: user.passwordHash,
    } as User

    this.items.push(newUser)

    return newUser
  }
}
