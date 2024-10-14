import { Prisma, UserCode } from '@prisma/client'
import { UserCodesRepository } from '../../src/repositories/user-codes-repository'

export class InMemoryUserCodesRepository implements UserCodesRepository {
  public items: UserCode[] = []

  async findByCode(code: string): Promise<UserCode | null> {
    const existentCode = this.items.find(item => item.code === code)

    if (!existentCode) {
      return null
    }

    return existentCode
  }

  async create(code: Prisma.UserCodeUncheckedCreateInput): Promise<void> {
    const newCode = {
      userId: code.userId,
      code: code.code,
      codeType: code.codeType,
      expiresAt: code.expiresAt,
    } as UserCode

    this.items.push(newCode)
  }

  async delete(codeId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === codeId)

    this.items.splice(itemIndex, 1)
  }
}
