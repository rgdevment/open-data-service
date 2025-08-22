import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailingService } from './mailing.service';
import { mailConfig } from './config/mail.config';

@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
