import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../../src/repositories/users-repository'

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

  async create(user: Prisma.UserUncheckedCreateInput): Promise<User> {
    const newUser = {
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
    } as User

    this.items.push(newUser)

    return newUser
  }
}
