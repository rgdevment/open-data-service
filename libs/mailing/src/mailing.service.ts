import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Resend } from 'resend';
import { mailConfig } from './config/mail.config';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class MailingService {
  private readonly resend: Resend;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.resend = new Resend(this.config.apiKey);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      } as any);
    } catch (error) {
      console.error('Error sending email via Resend:', error);
      throw error;
    }
  }
}
