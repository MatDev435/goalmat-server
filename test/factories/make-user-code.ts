import { UserCode } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import shortid from 'shortid'
import { myDayjs } from '../../src/utils/dayjs'

export function makeUserCode(override: Partial<UserCode> = {}) {
  const code = {
    id: randomUUID(),
    userId: randomUUID(),
    code: shortid.generate(),
    codeType: 'EMAIL_VERIFICATION',
    expiresAt: myDayjs().add(15, 'minute'),
    createdAt: new Date(),
    ...override,
  } as UserCode

  return code
}
