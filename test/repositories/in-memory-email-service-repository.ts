import { EmailServiceRepository } from '../../src/repositories/email/email-service-repository'
import shortid from 'shortid'
import { env } from '../../src/env'

interface Email {
  to: string
  subject: string
  body: string
}

export class InMemoryEmailServiceRepository implements EmailServiceRepository {
  public items: Email[] = []

  async sendEmailVerification(to: string, code: string): Promise<void> {
    this.items.push({
      to,
      subject: 'E-mail verification',
      body: `Code: ${code}`,
    })
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`

    this.items.push({
      to,
      subject: 'Reset password',
      body: `Reset link: ${resetLink}`,
    })
  }
}
