import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { otpConfig } from './config/otp.config';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from '@libs/cache';

@Module({
  imports: [ConfigModule.forFeature(otpConfig), RedisCacheModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
