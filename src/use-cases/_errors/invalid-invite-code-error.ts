export class InvalidInviteCodeError extends Error {
  constructor() {
    super('Invalid invite code.')
  }
}
