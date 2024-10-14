export class EmailAlreadyVerifiedError extends Error {
  constructor() {
    super('E-mail already verified.')
  }
}
