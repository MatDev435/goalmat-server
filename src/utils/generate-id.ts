import { customAlphabet } from 'nanoid'

export function generateId() {
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)()
}
