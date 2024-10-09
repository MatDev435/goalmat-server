import { EncrypterRepository } from '../../../src/repositories/cryptography/encrypter'

export class FakeEncrypter implements EncrypterRepository {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
