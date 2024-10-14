export interface EmailServiceRepository {
  sendEmailVerification(to: string): Promise<string>
}
