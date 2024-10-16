import { CodeType, Prisma, UserCode } from '@prisma/client'

export interface UserCodesRepository {
  findByCode(code: string): Promise<UserCode | null>
  findByUserId(userId: string, codeType: CodeType): Promise<UserCode | null>
  create(code: Prisma.UserCodeUncheckedCreateInput): Promise<void>
  delete(codeId: string): Promise<void>
}
