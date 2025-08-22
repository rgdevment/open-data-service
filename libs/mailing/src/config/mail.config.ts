import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.MAIL_FROM,
}));
