import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RedisCacheService } from '@libs/cache';
import type { OtpPurpose } from '@libs/common';
import { otpConfig } from './config/otp.config';

@Injectable()
export class OtpService {
  constructor(
    private readonly cacheService: RedisCacheService,
    @Inject(otpConfig.KEY)
    private readonly config: ConfigType<typeof otpConfig>,
  ) {}

  async generateAndStoreOtp(email: string, purpose: OtpPurpose): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `${purpose}:${email}`;
    const attemptsKey = `${purpose}_attempts:${email}`;

    await this.cacheService.set(otpKey, otp, this.config.ttl);
    await this.cacheService.set(attemptsKey, 0, this.config.ttl);

    return otp;
  }

  async validateOtp(email: string, otp: string, purpose: OtpPurpose): Promise<void> {
    const otpKey = `${purpose}:${email}`;
    const attemptsKey = `${purpose}_attempts:${email}`;

    const storedOtp = await this.cacheService.get<string>(otpKey);
    const attempts = (await this.cacheService.get<number>(attemptsKey)) ?? 0;

    if (!storedOtp) {
      throw new BadRequestException('Invalid or expired OTP. Please request a new one.');
    }

    if (storedOtp !== otp) {
      const newAttempts = attempts + 1;
      if (newAttempts >= this.config.attempts) {
        await this.cacheService.del(otpKey);
        await this.cacheService.del(attemptsKey);
        throw new BadRequestException('Too many incorrect attempts. Please request a new OTP.');
      }
      await this.cacheService.set(attemptsKey, newAttempts, this.config.ttl);
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    await this.cacheService.del(otpKey);
    await this.cacheService.del(attemptsKey);
  }
}
