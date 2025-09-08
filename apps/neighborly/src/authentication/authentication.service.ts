import { Injectable } from '@nestjs/common';
import { OtpPurpose } from '@libs/common';
import { OtpService } from '@libs/otp';
import { MailingService } from '@libs/mailing';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly mailingService: MailingService,
    private readonly otpService: OtpService,
  ) {}

  async requestOtp(email: string, purpose: OtpPurpose): Promise<void> {
    const otp = await this.otpService.generateAndStoreOtp(email, purpose);

    await this.mailingService.sendEmail({
      to: email,
      subject: `Tu código para Vecinal App: ${otp}`,
      text: `Usa este código para registrarte: ${otp}. Expira en 10 minutos.`,
      html: `<p>Tu código es: <strong>${otp}</strong>. Expira en 10 minutos.</p>`,
    });
  }
}
