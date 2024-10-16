export interface EmailServiceRepository {
  sendEmailVerification(to: string, code: string): Promise<void>
  sendPasswordReset(to: string, resetToken: string): Promise<void>
}
