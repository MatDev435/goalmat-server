export interface EmailServiceRepository {
  sendEmailVerification(to: string): Promise<string>
  sendPasswordReset(to: string, resetToken: string): Promise<void>
}
