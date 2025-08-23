import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule as SecurityAuthModule } from '@libs/security';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticationService } from './authentication.service';
import { OtpModule } from '@libs/otp';
import { MailingModule } from '@libs/mailing';

@Module({
  imports: [UsersModule, PassportModule, SecurityAuthModule, MailingModule, OtpModule],
  controllers: [AuthenticationController],
  providers: [LocalStrategy, AuthenticationService],
})
export class AuthenticationModule {}
