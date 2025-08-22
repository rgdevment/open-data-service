import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '@libs/cache';
import { MailingService } from '@libs/mailing';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly mailingService: MailingService,
    private readonly cacheService: RedisCacheService,
  ) {}

  async requestOtp(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const fiveMinutesInSeconds = 300;

    await this.cacheService.set(`otp:${email}`, otp, fiveMinutesInSeconds);
    await this.cacheService.set(`otp_attempts:${email}`, 0, fiveMinutesInSeconds);

    await this.mailingService.sendEmail({
      to: email,
      subject: `Tu código para Vecinal App: ${otp}`,
      text: `Usa este código para registrarte: ${otp}. Expira en 5 minutos.`,
      html: `<p>Tu código es: <strong>${otp}</strong>. Expira en 5 minutos.</p>`,
    });
  }
}
