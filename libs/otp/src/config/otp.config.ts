import { registerAs } from '@nestjs/config';

export const otpConfig = registerAs('otp', () => ({
  ttl: 300, //seconds
  attempts: 3, //times
}));
