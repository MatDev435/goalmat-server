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

  async sendEmailVerification(to: string): Promise<string> {
    const code = shortid.generate()

    this.items.push({
      to,
      subject: 'E-mail verification',
      body: `Code: ${code}`,
    })

    return code
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
