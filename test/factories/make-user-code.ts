import { UserCode } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { myDayjs } from '../../src/utils/dayjs'
import { generateId } from '../../src/utils/generate-id'

export function makeUserCode(override: Partial<UserCode> = {}) {
  const code = {
    id: randomUUID(),
    userId: randomUUID(),
    code: generateId(),
    codeType: 'EMAIL_VERIFICATION',
    expiresAt: myDayjs().add(15, 'minute'),
    createdAt: new Date(),
    ...override,
  } as UserCode

  return code
}
