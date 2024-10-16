export class InvalidResetTokenError extends Error {
  constructor() {
    super('Invalid reset token.')
  }
}
